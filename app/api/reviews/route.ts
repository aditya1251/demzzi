import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // adjust based on your setup

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch reviews." }, { status: 500 });
  }
}