import { prisma } from "@/lib/prisma";
import { loginValidate } from "../validation/validation";
import bcrypt from 'bcrypt'

export async function POST(req: Request) {
    try {
        const body = await req.json()

        const parsed = loginValidate.safeParse(body)

        if (!parsed.success) {
            return Response.json({ message: parsed.error.issues[0].message }, { status: 400 })
        }

        const { email, password } = parsed.data

        const existedUser = await prisma.users.findUnique({ where: { email } })

        if (!existedUser) {
            return Response.json({ message: `Account not found or wrong credentials` }, { status: 404 })
        }

        const passwordValidate = await bcrypt.compare(password, existedUser.password)

        if (!passwordValidate) {
            return Response.json({ message: `Invalid password` }, { status: 401 })
        }

        return Response.json({
            message: `User logged in successfully`, user: {
                email: existedUser.email,
                role: existedUser.role
            }
        }, { status: 200 })
    } catch (error) {
        return Response.json({ message: `Server error while login` }, { status: 500 })
    }
}