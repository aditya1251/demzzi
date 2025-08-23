import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { startOfDay, startOfWeek, startOfMonth, parseISO } from "date-fns";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const range = searchParams.get("range") || "all";
    const dateParam = searchParams.get("date");
    const startParam = searchParams.get("start");
    const endParam = searchParams.get("end");

    const now = new Date();
    let dateCondition: { gte?: Date; lte?: Date } | undefined;

    // Predefined ranges
    if (range === "today") {
      dateCondition = { gte: startOfDay(now) };
    } else if (range === "week") {
      dateCondition = { gte: startOfWeek(now, { weekStartsOn: 1 }) };
    } else if (range === "month") {
      dateCondition = { gte: startOfMonth(now) };
    }

    // Single date filter
    if (dateParam) {
      const parsed = parseISO(dateParam);
      if (isNaN(parsed.getTime())) {
        return NextResponse.json({ error: "Invalid date" }, { status: 400 });
      }
      const start = startOfDay(parsed);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      dateCondition = { gte: start, lte: end };
    }

    // Custom date range filter
    if (startParam && endParam) {
      const start = parseISO(startParam);
      const end = parseISO(endParam);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return NextResponse.json({ error: "Invalid custom range" }, { status: 400 });
      }
      const s = startOfDay(start);
      const e = startOfDay(end);
      e.setDate(e.getDate() + 1); // include full end day
      dateCondition = { gte: s, lte: e };
    }

    // Fetch stats
    const [userCount, revenueSum, pendingRequests, completedRequests] =
      await Promise.all([
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

    // Fetch recent activity
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
          service: { select: { title: true } },
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
        revenue: revenueSum?._sum?.amount ?? 0,
        pending: pendingRequests,
        completed: completedRequests,
      },
      recent: {
        users: recentActivity[0] ?? [],
        requests: recentActivity[1] ?? [],
        revenues: recentActivity[2] ?? [],
      },
    });
  } catch (err: any) {
    console.error("🚨 API /admin/overview error:", err);

    // Always return safe structure so frontend doesn’t crash
    return NextResponse.json(
      {
        error: "Internal Server Error",
        stats: { userCount: 0, revenue: 0, pending: 0, completed: 0 },
        recent: { users: [], requests: [], revenues: [] },
      },
      { status: 500 }
    );
  }
}
