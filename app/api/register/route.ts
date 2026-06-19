import { prisma } from "@/lib/prisma";
import { registerValidate } from "../validation/validation";
import bcrypt from 'bcrypt'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const parsed = registerValidate.safeParse(body)
    
        if (!parsed.success) {
            return Response.json({ message: parsed.error.issues[0].message }, { status: 400 })
        }
    
        const { name, email, password, phone, role } = parsed.data
    
        const existedUser = await prisma.users.findUnique({ where: { email } })
    
        if (existedUser) {
            return Response.json({ message: "User exists already" }, { status: 409 })
        }
    
        const hashedPassword = await bcrypt.hash(password, 10)
    
        const user = await prisma.users.create({
            data: {
                name, email, password: hashedPassword, phone, role
            }
        })
    
        return Response.json({
            message: `User created successfully`, user: {
                id: user.id, name: user.name, email: user.email, role: user.role
            }
        }, { status: 200 })
    } catch (error) {
        return Response.json({message:`Server error while registering`},{status:500})
    }
}