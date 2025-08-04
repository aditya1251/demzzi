// app/api/admin/users/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const users = await prisma.user.findMany({
    where: {
      isDeleted: false, // ⬅️ Exclude soft-deleted users
    },
    include: {
      requests: {
        where: {
          isDeleted: false, // ⬅️ Exclude soft-deleted requests
        },
      },
    },
  });

  const mapped = users.map((user) => {
    const totalOrders = user.requests.length;
    const totalSpent = user.requests.reduce((sum, sub) => {
      return sum + sub.amount;
    }, 0);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      location: user.location,
      joinDate: user.createdAt.toISOString(),
      totalOrders,
      totalSpent,
    };
  });

  return NextResponse.json(mapped);
}
