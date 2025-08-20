// app/api/admin/reviews/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: {
    id: string;
  };
}

export async function PUT(req: Request, { params }: Params) {
  const body = await req.json();

  try {
    const updated = await prisma.review.update({
      where: { id: params.id },
      data: {
        name: body.name,
        role: body.role,
        review: body.review,
        photo: body.photo,
        rating: body.rating,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update review." }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    await prisma.review.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete review." }, { status: 500 });
  }
}
