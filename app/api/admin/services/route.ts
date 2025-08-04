import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { FieldType } from "@prisma/client";

export async function POST(req: Request) {
  const body = await req.json();

  const { title, description, price, timeline, features, isActive, imageUrl } = body;

  // Create service with isDeleted: false
  const service = await prisma.service.create({
    data: {
      title,
      description,
      price: parseFloat(price),
      timeline,
      features,
      isActive,
      imageUrl,
      isDeleted: false, // ⬅️ explicitly set
    },
  });

  // Create default form fields with isDeleted: false
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
