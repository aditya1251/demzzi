import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { slugify } from "@/lib/slugify";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { name, imageUrl } = body;

    let updateData: any = { imageUrl };

    if (name) {
      updateData.name = name;
      let baseSlug = slugify(name);
      let slug = baseSlug;
      let counter = 1;

      while (await prisma.category.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${counter++}`;
      }

      updateData.slug = slug;
    }

    const category = await prisma.category.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(category);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}


export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const category = await prisma.category.update({
      where: { id },
      data: { isDeleted: true },
    });

    return NextResponse.json({ success: true, category });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
