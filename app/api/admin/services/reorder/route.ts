import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request) {
  const body = await req.json();
  const { orderedIds } = body as { orderedIds: string[] };

  if (!Array.isArray(orderedIds)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // Update priorities in a transaction
  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.service.update({
        where: { id },
        data: { priority: index + 1 }, // 1 is highest
      })
    )
  );

  return NextResponse.json({ success: true });
}
