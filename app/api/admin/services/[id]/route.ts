import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";

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
      isDeleted: false,
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
  const { title, description, price, timeline, features, isActive, imageUrl, categoryId } = body;

  let slug = existing.slug;

  // if title changed, regenerate slug
  if (title && title !== existing.title) {
    const baseSlug = slugify(title);
    slug = baseSlug;
    let counter = 1;

    while (await prisma.service.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }
  }

  const updated = await prisma.service.update({
    where: { id },
    data: {
      title,
      description,
      price: price ? parseFloat(price) : existing.price,
      timeline,
      features,
      isActive,
      imageUrl,
      categoryId: categoryId ?? existing.categoryId,
      slug,
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

  await prisma.service.update({
    where: { id },
    data: { isDeleted: true,
      slug: null,
     },
  });

  return NextResponse.json({ success: true });
}
