import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { FieldType } from "@prisma/client";
import { slugify } from "@/lib/slugify";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { 
      title, 
      description, 
      price, 
      timeline, 
      features, 
      isActive, 
      imageUrl, 
      categoryId 
    } = body;

    // find current highest priority
    const highestPriority = await prisma.service.aggregate({
      _max: { priority: true },
    });

    const nextPriority = (highestPriority._max.priority ?? 0) + 1;

    // generate slug from title
    const baseSlug = slugify(title);
    let slug = baseSlug;
    let counter = 1;

    // ensure uniqueness
    while (await prisma.service.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    // create service
    const service = await prisma.service.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        timeline,
        features,
        isActive,
        imageUrl,
        categoryId: categoryId || null, // ✅ allow null for old services
        isDeleted: false,
        priority: nextPriority,
        slug, // ✅ backend only
      },
    });

    // create default form fields
    await prisma.serviceFormField.createMany({
      data: [
        {
          serviceId: service.id,
          label: "Name",
          name: "name",
          type: FieldType.TEXT,
          required: true,
          placeholder: "Enter your name",
          options: [],
          order: 0,
          isFixed: true,
          isDeleted: false,
        },
        {
          serviceId: service.id,
          label: "Email",
          name: "email",
          type: FieldType.TEXT,
          required: true,
          placeholder: "Enter your email",
          options: [],
          order: 1,
          isFixed: true,
          isDeleted: false,
        },
        {
          serviceId: service.id,
          label: "Phone",
          name: "phone",
          type: FieldType.TEXT,
          required: true,
          placeholder: "Enter your phone number",
          options: [],
          order: 2,
          isFixed: true,
          isDeleted: false,
        },
        {
          serviceId: service.id,
          label: "Location",
          name: "location",
          type: FieldType.TEXT,
          required: false,
          placeholder: "Enter your location",
          options: [],
          order: 3,
          isFixed: true,
          isDeleted: false,
        },
      ],
    });

    return NextResponse.json(service);
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}
