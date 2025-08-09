import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const services = await prisma.service.findMany({
    where: {
      isDeleted: false, // Exclude soft-deleted services
    },
    orderBy: {
      priority: "asc",
    },
  });

  return NextResponse.json(services);
}
