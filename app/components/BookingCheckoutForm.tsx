"use client";

import { useState } from "react";
import Script from 'next/script'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { IndianRupee, Clock, Car } from "lucide-react";
import { createBookingAction } from "@/app/actions/booking-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createVehicleAction } from "../actions/vehicle-actions";
import { Input } from "@/components/ui/input";

export default function BookingCheckoutForm({ lot, userVehicles, userId }: { lot: any, userVehicles: any[], userId: string }) {
  const router = useRouter();
  const [duration, setDuration] = useState("1");
  const [vehicleId, setVehicleId] = useState(userVehicles.length > 0 ? userVehicles[0].id : "");
  const [loading, setLoading] = useState(false);

  const totalPrice = parseInt(duration) * lot.pricePerHour;

  const handleBooking = async () => {
    if (!vehicleId) {
      toast.error("Please select a vehicle!");
      return;
    }

    setLoading(true);
    try {
      const orderResponse = await fetch('/api/razorpay/create-order', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ amount: totalPrice })
      })

      const orderData = await orderResponse.json()

      if (orderData.error) throw new Error(orderData.error)

      // Configure the razorpay popup
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: totalPrice * 100,
        currency: "INR",
        name: "ParkEase",
        description: "Parking Spot Reservation",
        order_id: orderData.orderId,

        // after successful payment
        handler: async function (response:any){
          toast.success(`Payment Received! Verifying slot...`)

          const verifyResponse = await fetch(`/api/razorpay/verify`,{
            method:"POST",
            headers:{
              "Content-Type":"application/json"
            },
            body:JSON.stringify({
              razorpay_order_id:response.razorpay_order_id,
              razorpay_payment_id:response.razorpay_payment_id,
              razorpay_signature:response.razorpay_signature,
              bookingData:{
                lotId:lot.id,
                vehicleId:vehicleId,
                durationHours:parseInt(duration),
                total_price:totalPrice,
                userId:userId,
                vehicleType:userVehicles.find(v=>v.id === vehicleId)?.type || "CAR"
              }
            })
          })

          const verifyData = await verifyResponse.json()

          if(verifyData.success){
            toast.success(`Spot Confirmed & Locked!`)
            router.push('/dashboard/spotter/active-tickets')
          }
          else{
            toast.error(`${verifyData.error || `Failed to secure or book the slot`}`)
            setLoading(false)
          }
        },
        prefill:{
          name:"Test Driver",
          email:"test@example.com",
          contact:"8244415863"
        },
        theme:{
          color:"#10b981"
        }
      }
      
      const rzp = new (window as any).Razorpay(options)
      rzp.on(`payment.failed`, function (response:any){
        toast.error(`Payment failed. Please try again`)
        setLoading(false)
      })
      rzp.open()
    } catch (err) {
      toast.error("Something went wrong!");
      setLoading(false);
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <Card className="border-primary/20 shadow-md">
        <CardHeader className="bg-muted/50 border-b border-border">
          <CardTitle className="flex justify-between items-center">
            <span>Reservation Details</span>
            <span className="text-sm font-normal text-muted-foreground bg-background px-3 py-1 rounded-full border border-border shadow-sm">
              Instant Confirmation
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">

          {/* VEHICLE SELECTION */}
          <div className="space-y-2">
            <Label htmlFor="vehicle" className="flex justify-between">
              <span>Select Vehicle</span>
              <Dialog>
                <DialogTrigger asChild>
                  <span className="text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors font-medium">
                    + Add New
                  </span>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add a New Vehicle</DialogTitle>
                  </DialogHeader>
                  <form action={async (formData) => {
                    const result = await createVehicleAction(formData);
                    if (result?.error) {
                      toast.error(result.error);
                    } else {
                      toast.success("Vehicle Added Successfully!");
                    }
                  }} className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label>Vehicle Type</Label>
                      <Select name="type" defaultValue="CAR">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CAR">Car</SelectItem>
                          <SelectItem value="BIKE">Bike</SelectItem>
                          <SelectItem value="MPV">MPV / SUV</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Model (e.g. Honda City)</Label>
                      <Input name="model" required placeholder="Enter vehicle model" />
                    </div>
                    <div className="space-y-2">
                      <Label>License Plate (e.g. WB-01-AB-1234)</Label>
                      <Input name="number" required placeholder="Enter license plate" />
                    </div>
                    <Button type="submit" className="w-full mt-4">Save Vehicle</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </Label>
            {userVehicles.length > 0 ? (
              <Select value={vehicleId} onValueChange={setVehicleId}>
                <SelectTrigger id="vehicle" className="h-12">
                  <SelectValue placeholder="Select your vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {userVehicles.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-muted-foreground" />
                        <span>{v.vehicle_model}</span>
                        <span className="text-xs text-muted-foreground ml-2">({v.vehicle_number})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="p-4 border border-dashed border-destructive/50 rounded-lg text-center bg-destructive/5">
                <p className="text-sm text-destructive font-medium mb-2">No vehicles found!</p>
                <Button variant="outline" size="sm" className="w-full">
                  Add your first vehicle
                </Button>
              </div>
            )}
          </div>

          {/* MODAL IS NOW INSIDE THE LABEL ABOVE */}

          {/* DURATION SELECTION */}
          <div className="space-y-2">
            <Label htmlFor="duration">Parking Duration (Hours)</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger id="duration" className="h-12">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 6, 8, 12, 24].map((hours) => (
                  <SelectItem key={hours} value={hours.toString()}>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{hours} {hours === 1 ? 'Hour' : 'Hours'}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

        </CardContent>

        <CardFooter className="flex flex-col bg-muted/20 border-t border-border pt-6 gap-6">

          {/* PRICE BREAKDOWN */}
          <div className="w-full space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Parking Rate</span>
              <span>₹{lot.pricePerHour} / hr</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Duration</span>
              <span>{duration} hr(s)</span>
            </div>
            <div className="w-full h-px bg-border my-2"></div>
            <div className="flex justify-between items-end">
              <span className="font-bold text-lg">Total Amount</span>
              <span className="font-black text-3xl text-primary flex items-center">
                <IndianRupee className="h-6 w-6 mr-1" />{totalPrice}
              </span>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <Button
            className="w-full h-14 text-lg font-bold shadow-lg transition-all"
            onClick={handleBooking}
            disabled={loading || userVehicles.length === 0}
          >
            {loading ? "Confirming..." : "Pay & Reserve Spot"}
          </Button>
          <p className="text-xs text-center text-muted-foreground flex items-center justify-center w-full">
            Secure payment powered by ParkEase
          </p>

        </CardFooter>
      </Card>
    </>
  );
}
