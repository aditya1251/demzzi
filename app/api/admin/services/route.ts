import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { FieldType } from "@prisma/client";

export async function POST(req: Request) {
  const body = await req.json();

  const { title, description, price, timeline, features, isActive, imageUrl } = body;

  // Find current highest priority
  const highestPriority = await prisma.service.aggregate({
    _max: {
      priority: true,
    },
  });

  const nextPriority = (highestPriority._max.priority ?? 0) + 1;

  // Create service with isDeleted: false and highest priority
  const service = await prisma.service.create({
    data: {
      title,
      description,
      price: parseFloat(price),
      timeline,
      features,
      isActive,
      imageUrl,
      isDeleted: false,
      priority: nextPriority, // ⬅️ set highest priority
    },
  });

  // Create default form fields
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
}
