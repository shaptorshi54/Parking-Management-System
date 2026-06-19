import { z } from 'zod'

const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const registerValidate = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().regex(passwordRegex, `Password must contain uppercase, lowercase, number and special character`),
    phone: z.string().min(10, `Phone number must be of atleast 10 digits`),
    role: z.enum(['USER', 'OWNER'])
})

export const loginValidate = z.object({
    email: z.string().email().transform(val => val.toLowerCase()),
    password: z.string().min(6, "Password is required")
})

export const parkingLotValidate = z.object({
    name: z.string().min(3).max(100),
    pricePerHour: z.number().min(0),
    address: z.string().min(5),
    lat: z.string().optional(),
    lng: z.string().optional(),
    description: z.string().max(500).optional(),
    amenities: z.array(z.string()),
    is_24_7: z.boolean(),
    opening_time: z.string().optional(),
    closing_time: z.string().optional(),
    slots_car: z.number().min(0),
    slots_bike: z.number().min(0),
    slots_mpv: z.number().min(0),
})

export const parkingSlotsValidate = z.object({
    lot_id: z.string(),
    slot_number: z.int(),
    slot_type: z.enum(['CAR', 'BIKE', 'MPV']),
    status: z.enum(['AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'CLOSED'])
})

export const bookingValidate = z.object({
    slot_id:z.string(),
    booking_start: z.coerce.date(),
    booking_end: z.coerce.date(),
    total_price: z.number().int(),
    status: z.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']),
}).refine((data) => data.booking_end > data.booking_start, {
    message: "Booking end time must be greater than starting time",
    path: ["booking_end"]
})