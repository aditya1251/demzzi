import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { startOfDay, startOfWeek, startOfMonth, parseISO } from "date-fns";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const range = searchParams.get("range") || "all";
  const dateParam = searchParams.get("date"); // for custom single date
  const startParam = searchParams.get("start"); // for custom range
  const endParam = searchParams.get("end");

  const now = new Date();
  let dateCondition: { gte?: Date; lte?: Date } | undefined;

  // Predefined Ranges
  if (range === "today") {
    const today = startOfDay(now);
    dateCondition = { gte: today };
  } else if (range === "week") {
    const start = startOfWeek(now, { weekStartsOn: 1 });
    dateCondition = { gte: start };
  } else if (range === "month") {
    const start = startOfMonth(now);
    dateCondition = { gte: start };
  }

  // Custom single date (e.g., ?date=2025-08-07)
  if (dateParam) {
    try {
      const parsed = parseISO(dateParam);
      const start = startOfDay(parsed);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      dateCondition = { gte: start, lte: end };
    } catch (err) {
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });
    }
  }

  // Custom range (e.g., ?start=2025-08-01&end=2025-08-07)
  if (startParam && endParam) {
    try {
      const start = startOfDay(parseISO(startParam));
      const end = startOfDay(parseISO(endParam));
      end.setDate(end.getDate() + 1); // include full end day
      dateCondition = { gte: start, lte: end };
    } catch (err) {
      return NextResponse.json({ error: "Invalid custom range" }, { status: 400 });
    }
  }

  // Fetch data with optional filters
  const [userCount, revenueSum, pendingRequests, completedRequests] = await Promise.all([
    prisma.user.count({
      where: {
        isDeleted: false,
        ...(dateCondition ? { createdAt: dateCondition } : {}),
      },
    }),
    prisma.revenue.aggregate({
      _sum: { amount: true },
      where: {
        isDeleted: false,
        ...(dateCondition ? { createdAt: dateCondition } : {}),
      },
    }),
    prisma.request.count({
      where: {
        status: { in: ["PENDING", "NEW"] },
        isDeleted: false,
        ...(dateCondition ? { updatedAt: dateCondition } : {}),
      },
    }),
    prisma.request.count({
      where: {
        status: "COMPLETED",
        isDeleted: false,
        ...(dateCondition ? { updatedAt: dateCondition } : {}),
      },
    }),
  ]);

  const recentActivity = await prisma.$transaction([
    prisma.user.findMany({
      where: {
        isDeleted: false,
        ...(dateCondition ? { createdAt: dateCondition } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: { name: true, createdAt: true },
    }),
    prisma.request.findMany({
      where: {
        status: "PENDING",
        isDeleted: false,
        ...(dateCondition ? { updatedAt: dateCondition } : {}),
      },
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
      where: {
        isDeleted: false,
        ...(dateCondition ? { createdAt: dateCondition } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: { amount: true, createdAt: true, label: true },
    }),
  ]);

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
  });
}
