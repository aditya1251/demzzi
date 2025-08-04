import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params?: { id?: string };
}

// GET /api/services/:id
export async function GET(_: Request, { params }: Params) {
  const id = params?.id;
  if (!id) {
    return NextResponse.json({ error: "Missing service ID" }, { status: 400 });
  }

  const service = await prisma.service.findFirst({
    where: {
      id,
      isDeleted: false, // ⬅️ Exclude soft-deleted services
    },
  });

  if (!service) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(service);
}

// PUT /api/services/:id
export async function PUT(req: Request, { params }: Params) {
  const id = params?.id;
  if (!id) {
    return NextResponse.json({ error: "Missing service ID" }, { status: 400 });
  }

  const existing = await prisma.service.findUnique({ where: { id } });
  if (!existing || existing.isDeleted) {
    return NextResponse.json({ error: "Cannot update deleted or missing service" }, { status: 404 });
  }

  const body = await req.json();
  const { title, description, price, timeline, features, isActive, imageUrl } = body;

  const updated = await prisma.service.update({
    where: { id },
    data: {
      title,
      description,
      price: parseFloat(price),
      timeline,
      features,
      isActive,
      imageUrl,
    },
  });

  return NextResponse.json(updated);
}

// DELETE /api/services/:id
export async function DELETE(_: Request, { params }: Params) {
  const id = params?.id;
  if (!id) {
    return NextResponse.json({ error: "Missing service ID" }, { status: 400 });
  }

  // Soft delete instead of hard delete
  await prisma.service.update({
    where: { id },
    data: { isDeleted: true },
  });

  return NextResponse.json({ success: true });
}
