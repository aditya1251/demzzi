import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const source = searchParams.get("source");
    const userId = searchParams.get("userId");
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const filters: any = {
      isDeleted: false, // ⬅️ Soft delete filter
    };

    if (source) filters.source = source;
    if (userId) filters.userId = userId;
    if (from || to) {
      filters.createdAt = {};
      if (from) filters.createdAt.gte = new Date(from);
      if (to) filters.createdAt.lte = new Date(to);
    }

    const revenues = await prisma.revenue.findMany({
      where: filters,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(revenues);
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
