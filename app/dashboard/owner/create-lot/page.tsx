"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { MapPin, CarFront, ShieldCheck, Clock, Zap } from "lucide-react";
import { useForm, Controller } from 'react-hook-form'
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// 1. Define the exact shape of your form data
type FormInputs = {
  name: string;
  pricePerHour: number;
  address: string;
  lat: string;
  lng: string;
  description: string;
  amenities: string[];
  is_24_7: boolean;
  opening_time: string;
  closing_time: string;
  slots_car: number;
  slots_bike: number;
  slots_mpv: number;
}

export default function page() {
  const router = useRouter()
  // 2. Initialize the form with default values
  const { register, handleSubmit, control, watch } = useForm<FormInputs>({
    defaultValues: {
      amenities: [],
      is_24_7: false,
      opening_time: "08:00",
      closing_time: "22:00",
    }
  });

  // Watch the switch state so we can disable the time inputs
  const is24_7 = watch("is_24_7");

  // 3. The function that runs when the form is submitted
  const onSubmit = async (data: FormInputs) => {
    // console.log("READY TO SEND TO DATABASE:", data);
    // Next step: Send this 'data' object to your Server Action
    const res = await fetch('/api/parking_lots',{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(data)
    })

    const result = await res.json()

    if(!res.ok){
      toast.error(result.message)
      return
    }

    toast.success(`Parking Lot Created Successfully`)
    router.push('/dashboard/owner/lots')

  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Parking Lot</h1>
        <p className="text-muted-foreground mt-1">
          Add a new parking location and generate your inventory slots.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* SECTION 1: General Info (Using standard register) */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Location Details
            </CardTitle>
            <CardDescription>Basic information about your parking garage.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Lot Name</Label>
                <Input placeholder="e.g. Downtown Plaza Garage" required {...register("name")} />
              </div>
              <div className="space-y-2">
                <Label>Price per Hour (₹)</Label>
                <Input type="number" placeholder="e.g. 50" required {...register("pricePerHour", { valueAsNumber: true })} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Full Street Address</Label>
              <Input placeholder="123 Main Street, City" required {...register("address")} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Latitude (Optional)</Label>
                <Input placeholder="28.6139" {...register("lat")} />
              </div>
              <div className="space-y-2">
                <Label>Longitude (Optional)</Label>
                <Input placeholder="77.2090" {...register("lng")} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea placeholder="Describe the parking lot..." className="h-24" {...register("description")} />
            </div>
          </CardContent>
        </Card>

        {/* SECTION 2: Amenities & Hours */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Amenities
              </CardTitle>
              <CardDescription>What features does this lot offer?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {/* Using Controller for the custom Checkbox array */}
              <Controller
                name="amenities"
                control={control}
                render={({ field }) => {
                  // Helper function to handle adding/removing strings from the array
                  const handleCheck = (checked: boolean, value: string) => {
                    if (checked) {
                      field.onChange([...field.value, value]);
                    } else {
                      field.onChange(field.value.filter((val) => val !== value));
                    }
                  };

                  return (
                    <>
                      {["CCTV Surveillance", "Security Guard", "Covered Parking", "EV Charging"].map((amenity) => (
                        <div key={amenity} className="flex items-center space-x-3">
                          <Checkbox
                            checked={field.value?.includes(amenity)}
                            onCheckedChange={(checked) => handleCheck(checked as boolean, amenity)}
                          />
                          <Label className="font-normal cursor-pointer">{amenity}</Label>
                        </div>
                      ))}
                    </>
                  );
                }}
              />
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Operating Hours
              </CardTitle>
              <CardDescription>When can drivers park here?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="flex items-center justify-between rounded-lg border p-4 bg-muted/50">
                <div className="space-y-0.5">
                  <Label className="text-base">24/7 Access</Label>
                  <p className="text-sm text-muted-foreground">Is this lot open all day and night?</p>
                </div>
                {/* Using Controller for the custom Switch */}
                <Controller
                  name="is_24_7"
                  control={control}
                  render={({ field }) => (
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  )}
                />
              </div>

              <div className={`grid grid-cols-2 gap-4 ${is24_7 ? "opacity-50 pointer-events-none" : ""}`}>
                <div className="space-y-2">
                  <Label>Opening Time</Label>
                  <Input type="time" disabled={is24_7} {...register("opening_time")} />
                </div>
                <div className="space-y-2">
                  <Label>Closing Time</Label>
                  <Input type="time" disabled={is24_7} {...register("closing_time")} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SECTION 3: Slot Generation */}
        <Card className="shadow-sm border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CarFront className="h-5 w-5 text-primary" />
              Inventory Engine
            </CardTitle>
            <CardDescription className="text-primary/80">
              Specify how many slots to automatically generate in the database.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="font-bold">Total CAR Slots</Label>
                <Input type="number" placeholder="e.g. 50" min="0" className="bg-background" {...register("slots_car", { valueAsNumber: true })} />
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Total BIKE Slots</Label>
                <Input type="number" placeholder="e.g. 20" min="0" className="bg-background" {...register("slots_bike", { valueAsNumber: true })} />
              </div>
              <div className="space-y-2">
                <Label className="font-bold">Total MPV Slots</Label>
                <Input type="number" placeholder="e.g. 10" min="0" className="bg-background" {...register("slots_mpv", { valueAsNumber: true })} />
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-primary/10 py-4 mt-6 border-t border-primary/20 rounded-b-lg">
            <Button type="submit" size="lg" className="w-full font-bold text-md shadow-lg shadow-primary/25">
              Create Lot & Generate Slots
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
