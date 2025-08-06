// pages/api/submissions.ts
import { prisma } from "@/lib/prisma" // adjust import to your actual prisma client path
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const { formData, serviceId } = await req.json()

        if (!formData?.email || !serviceId) {
            return NextResponse.json({ error: "Email and serviceId are required" }, { status: 400 })
        }

        // Check if user exists
        let user = await prisma.user.findUnique({
            where: { email: formData.email },
        })

        // If not, create a new one
        if (!user) {
            user = await prisma.user.create({
                data: {
                    email: formData.email,
                    name: formData.name || undefined,
                    phone: formData.phone || undefined,
                    location: formData.location || undefined,
                    newAccount: true,
                },
            })
        }

        const service = await prisma.service.findUnique({
            where: { id: serviceId },
        })

        if (!service) {
            return NextResponse.json({ error: "Service not found" }, { status: 404 })
        }
        const request = await prisma.request.create({
            data: {
                userId: user.id,
                serviceId: serviceId,
                amount: service.price,
                status: "PENDING",
                serviceName: service.title,
            }
        })

        // Create submission
        await prisma.submission.create({
            data: {
                userId: user.id,
                requestId: request.id, serviceId: serviceId,
                formData,
                status: "NEW",
            },
        })

        return NextResponse.json({ success: true })
    } catch (err) {
        console.error("API error:", err)
        return NextResponse.json({ error: "Server error" }, { status: 500 })
    }
}
