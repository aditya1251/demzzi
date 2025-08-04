import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get("search") || ""
  const status = searchParams.get("status") || "all"

  const requests = await prisma.request.findMany({
    where: {
      isDeleted: false, // ✅ exclude soft-deleted requests
      AND: [
        status !== "all" ? { status: status.toUpperCase() as any } : {},
        {
          OR: [
            { user: { name: { contains: search, mode: "insensitive" } } },
            { serviceName: { contains: search, mode: "insensitive" } },
          ],
        },
      ],
    },
    include: {
      user: true,
      service: true
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  const formatted = requests.map((req) => ({
    id: req.id,
    clientName: req.user?.name ?? "Unknown",
    clientEmail: req.user?.email ?? "—",
    clientPhone: req.user?.phone ?? "—",
    serviceType: req.serviceName,
    status: req.status.toLowerCase(),
    requestDate: req.createdAt.toISOString(),
    timeAgo: dayjs(req.createdAt).fromNow(),
    description: req.service?.description ?? "",
  }))

  return NextResponse.json({ requests: formatted })
}
