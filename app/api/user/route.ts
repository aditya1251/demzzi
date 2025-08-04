// app/api/user/route.ts or pages/api/user.ts (depending on your structure)

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json()

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        requests: {
          where: { isDeleted: false },
          orderBy: { createdAt: "desc" },
          include: {
            service: true,
            submissions: true,
          },
        },
      },
    })

    return NextResponse.json(user?.requests || [])
  } catch (error) {
    console.error("Error fetching user requests:", error)
    return NextResponse.json({ error: "Server Error" }, { status: 500 })
  }
}
