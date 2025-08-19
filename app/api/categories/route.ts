import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const categories = await prisma.category.findMany({
    where: { isDeleted: false },
    orderBy: { priority: "asc" },
    include: { services: {where: {isDeleted: false}} },
  });

  return NextResponse.json(categories);
}
