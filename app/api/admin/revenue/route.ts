import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const source = searchParams.get("source");
    const userId = searchParams.get("userId");
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const filters: any = {
      isDeleted: false,
    };

    if (source) filters.source = source;
    if (userId) filters.userId = userId;
    if (from || to) {
      filters.createdAt = {};
      if (from) filters.createdAt.gte = new Date(from);
      if (to) filters.createdAt.lte = new Date(to);
    }

    // ⬅️ Full stats (not paginated)
    const [totalRevenue, thisMonthRevenue, totalEntries] = await Promise.all([
      prisma.revenue.aggregate({
        _sum: { amount: true },
        where: filters,
      }),
      prisma.revenue.aggregate({
        _sum: { amount: true },
        where: {
          ...filters,
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // 1st of this month
          },
        },
      }),
      prisma.revenue.count({ where: filters }),
    ]);

    // ⬅️ Paginated entries
    const paginatedRevenues = await prisma.revenue.findMany({
      where: filters,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      skip,
      take: limit,
    });

    return NextResponse.json({
      data: paginatedRevenues,
      page,
      limit,
      total: totalEntries,
      totalPages: Math.ceil(totalEntries / limit),
      summary: {
        totalRevenue: totalRevenue._sum.amount ?? 0,
        thisMonthRevenue: thisMonthRevenue._sum.amount ?? 0,
        totalEntries,
      },
    });
  } catch (error) {
    console.error("Failed to fetch revenue:", error);
    return NextResponse.json({ error: "Failed to load revenue" }, { status: 500 });
  }
}


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, label, note, createdAt, userId, source = "MANUAL" } = body;

    if (!amount || isNaN(amount)) {
      return NextResponse.json({ error: "Amount is required and must be a number." }, { status: 400 });
    }

    const revenue = await prisma.revenue.create({
      data: {
        amount: parseFloat(amount),
        label: label || null,
        note: note || null,
        userId: userId || null,
        source,
        createdAt: createdAt ? new Date(createdAt) : undefined,
        isDeleted: false, // ⬅️ Always explicitly set on creation
      },
    });

    return NextResponse.json(revenue);
  } catch (error) {
    console.error("Failed to create revenue:", error);
    return NextResponse.json({ error: "Failed to create revenue" }, { status: 500 });
  }
}
