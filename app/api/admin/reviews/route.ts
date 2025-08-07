// app/api/admin/reviews/route.ts
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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, role, review, rating } = body;

    if (!name || !role || !review || !rating) {
      return NextResponse.json({ error: "Missing fields." }, { status: 400 });
    }

    const newReview = await prisma.review.create({
      data: { name, role, review, rating },
    });

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add review." }, { status: 500 });
  }
}
