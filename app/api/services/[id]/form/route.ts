// pages/api/services/[id]/form.ts

import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const serviceId = params.id

  if (!serviceId) {
    return NextResponse.json({ error: "Missing serviceId" }, { status: 400 })
  }

  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    include: {
      formFields: {
        where: { isDeleted: false },
        orderBy: { order: "asc" },
      },
    },
  })

  if (!service) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 })
  }

  return NextResponse.json({
    title: service.title,
    subtitle: service.description,
    fields: service.formFields.map((field) => ({
      name: field.name,
      label: field.label,
      type: field.type.toLowerCase(), // convert ENUM to lowercase string for frontend
      placeholder: field.placeholder || "",
      required: field.required,
      options: field.options,
    })),
  })
}
