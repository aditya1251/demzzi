import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)

export async function GET() {
  try {
    const messages = await prisma.contactRequest.findMany({
      where: {
        isDeleted: false, // ✅ filter out soft-deleted records
      },
      orderBy: { createdAt: "desc" },
    })

    const formatted = messages.map((req) => ({
      id: req.id,
      name: req.name,
      email: req.email,
      phone: req.phone ?? "",
      subject: req.subject ?? "",
      message: req.message,
      createdDate: req.createdAt.toISOString(),
      timeAgo: dayjs(req.createdAt).fromNow(),
    }))

    return NextResponse.json(formatted)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}
