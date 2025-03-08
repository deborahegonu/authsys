import { db } from "@/lib/db";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import * as z from "zod"

const salt_rounds = 12;

// Define schema for input validation
const userSchema = z.object({
  email: z.string()
  .min(1, "Email is required.").email('Please use a valid email address.'),
  password: z.string()
  .min(1, "Password is required.").min(8, 'Password must have at least 8 characters.')
})

export async function POST(req: Request) {
   try {
    const body = await req.json()
    const { email, password } = userSchema.parse(body);

    // check if email already exists
    const existingUserByEmail = await db.user.findUnique({
        where: {
            email: email
        }
    });

    if(existingUserByEmail) {
        return NextResponse.json({ user: null, message: 'Email is already in use.'}, { status: 409})
    }

    // email not found then hash password and create new user
    const hashedPassword = await hash(password, salt_rounds);
    const newUser = await db.user.create({
        data: {
            email,
            password: hashedPassword,
        }
    })

    // return new user without password
    const { password: newUserPassword, ...rest } = newUser;

    return NextResponse.json({ user: rest, message: "Sign up successful!"}, { status: 201 })
   } catch(error) {
    return NextResponse.json({  message: error}, { status: 500 })
   }
}