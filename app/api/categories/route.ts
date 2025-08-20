import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const revalidate = 60;

export async function GET() {
  const categories = await prisma.category.findMany({
    where: { isDeleted: false },
    orderBy: { priority: "asc" },
    include: { services: {where: {isDeleted: false}} },
  });

  return NextResponse.json(categories,{
    headers: {
      "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
    },
  });
}
