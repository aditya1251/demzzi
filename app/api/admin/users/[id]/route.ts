import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params

  try {
    const user = await prisma.user.findFirst({
      where: {
        id,
        isDeleted: false, // ⬅️ exclude soft-deleted users
      },
      include: {
        requests: {
          where: { isDeleted: false }, // ⬅️ exclude soft-deleted requests
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true,
            serviceName: true,
            createdAt: true,
            amount: true,
            status: true,
          },
        },
      },
    })

    if (!user) return new NextResponse('User not found', { status: 404 })

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      location: user.location,
      joinDate: user.createdAt,
      totalOrders: user.requests.length,
      totalSpent: user.requests.reduce((sum, r) => sum + r.amount, 0),
      recentOrders: user.requests.map((r) => ({
        id: r.id,
        serviceName: r.serviceName,
        createdAt: r.createdAt,
        amount: r.amount,
        status: r.status,
      })),
    })
  } catch (err) {
    console.error(err)
    return new NextResponse('Internal server error', { status: 500 })
  }
}
