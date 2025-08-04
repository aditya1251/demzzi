import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const [userCount, revenueSum, pendingRequests, completedRequests] = await Promise.all([
    prisma.user.count({ where: { isDeleted: false } }),
    prisma.revenue.aggregate({
      _sum: { amount: true },
      where: { isDeleted: false },
    }),
    prisma.request.count({
      where: { status: { in: ["PENDING", "NEW"] }, isDeleted: false },
    }),
    prisma.request.count({
      where: { status: "COMPLETE", isDeleted: false },
    }),
  ])

  const recentActivity = await prisma.$transaction([
    prisma.user.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: { name: true, createdAt: true },
    }),
    prisma.request.findMany({
      where: { status: "NEW", isDeleted: false },
      orderBy: { updatedAt: "desc" },
      take: 3,
      select: {
        updatedAt: true,
        status: true,
        service: {
          select: { title: true },
        },
      },
    }),
    prisma.revenue.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: { amount: true, createdAt: true, label: true },
    }),
  ])

  return NextResponse.json({
    stats: {
      userCount,
      revenue: revenueSum._sum.amount || 0,
      pending: pendingRequests,
      completed: completedRequests,
    },
    recent: {
      users: recentActivity[0],
      requests: recentActivity[1],
      revenues: recentActivity[2],
    },
  })
}
