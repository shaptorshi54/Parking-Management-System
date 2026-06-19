"use client"

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { updateSlotStatus } from '../actions/slot-actions'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Car } from 'lucide-react'

export default function SlotDialogBox({ slot, lotId }: { slot: any, lotId: string }) {
    const [isOpen, setIsOpen] = useState(false)

    const handleSubmit = async (formData: FormData) => {
        await updateSlotStatus(formData)
        setIsOpen(false)
    }
    return (
        <Dialog key={slot.id} open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger>
                <div
                    className={`aspect-square rounded-md border flex flex-col items-center justify-center gap-1 cursor-pointer hover:scale-105 transition-transform
                                                        ${slot.status === 'AVAILABLE' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' :
                            slot.status === 'OCCUPIED' ? 'bg-slate-500/10 border-slate-500/30 text-slate-400' :
                                'bg-red-500/10 border-red-500/30 text-red-500'}
                                                            `}
                >
                    <Car className="h-4 w-4 opacity-70" />
                    <span className="text-[10px] font-bold opacity-90">C{slot.slot_number}</span>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-106.25">
                <DialogHeader>
                    <DialogTitle>Manage Slot B{slot.slot_number}</DialogTitle>
                    <DialogDescription>
                        View occupant details or manually override the availability status.
                    </DialogDescription>
                </DialogHeader>

                <form action={handleSubmit} className="space-y-6 pt-4">
                    <input type="hidden" name="slotId" value={slot.id} />
                    <input type="hidden" name="lotId" value={lotId} />

                    {slot.status === 'OCCUPIED' ? (
                        <div className="bg-slate-500/10 p-4 rounded-lg border border-slate-500/20">
                            <p className="text-sm font-semibold mb-1 text-slate-400">Current Occupant</p>
                            <p className="text-sm">Driver details will appear here once booking system is connected.</p>
                        </div>
                    ) : (
                        <div className="bg-muted p-4 rounded-lg border border-border">
                            <p className="text-sm text-muted-foreground">This slot is currently empty.</p>
                        </div>
                    )}

                    <div className="space-y-3">
                        <label className="text-sm font-semibold">Force Status Change</label>
                        <Select name="status" defaultValue={slot.status}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="AVAILABLE">Available</SelectItem>
                                <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                                <SelectItem value="CLOSED">Closed</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground mt-1">
                            Note: Setting this to Maintenance will instantly hide this slot from all drivers on the app.
                        </p>
                    </div>

                    <DialogFooter>
                        <Button type="submit" className="w-full">Save Changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
