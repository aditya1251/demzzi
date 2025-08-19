import { NextResponse } from "next/server";
import { slugify } from "@/lib/slugify";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, imageUrl } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // generate unique slug
    let baseSlug = slugify(name);
    let slug = baseSlug;
    let counter = 1;

    while (await prisma.category.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const count = await prisma.category.count();

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        imageUrl,
        priority: count,
      },
    });

    return NextResponse.json(category);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
