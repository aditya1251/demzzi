import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const revenues = await prisma.revenue.findMany({
      where: { isDeleted: false }, // ⬅️ Filter out soft-deleted entries
      orderBy: { createdAt: "desc" },
    });

    const monthlyMap: Record<string, number> = {};

    for (const r of revenues) {
      const key = new Date(r.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });

      if (!monthlyMap[key]) {
        monthlyMap[key] = 0;
      }

      monthlyMap[key] += r.amount - (r.discount || 0);
    }

    const monthlyRevenue = Object.entries(monthlyMap).map(([month, total]) => ({
      month,
      total: Number(total.toFixed(2)),
    }));

    return NextResponse.json(monthlyRevenue);
  } catch (error) {
    console.error("Error fetching revenue:", error);
    return NextResponse.json({ error: "Failed to fetch revenue." }, { status: 500 });
  }
}
