// app/api/admin/users/export/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const users = await prisma.user.findMany({
    where: {
      isDeleted: false, // ⬅️ Exclude deleted users
    },
    include: {
      requests: {
        where: {
          isDeleted: false, // ⬅️ Exclude deleted requests
        },
      },
    },
  });

  const headers = [
    "ID",
    "Name",
    "Email",
    "Phone",
    "Location",
    "Join Date",
    "Total Orders",
    "Total Spent",
  ];

  const rows = users.map((user) => [
    user.id,
    user.name,
    user.email,
    user.phone,
    user.location,
    user.createdAt.toISOString(),
    user.requests.length,
    user.requests.reduce((sum, req) => sum + req.amount, 0),
  ]);

  const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");

  return new Response(csvContent, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=users-export.csv",
    },
  });
}
