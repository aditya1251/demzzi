import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, subject, message } = body

    if (!name || !email || !phone || !subject || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const contact = await prisma.contactRequest.create({
      data: {
        name,
        email,
        phone,
        subject,
        message,
      },
    })

    return NextResponse.json({ message: "Contact request submitted successfully", contact }, { status: 201 })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
