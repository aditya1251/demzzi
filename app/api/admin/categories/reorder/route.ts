import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { orderedIds } = body as { orderedIds: string[] };

    // update priorities in order
    await Promise.all(
      orderedIds.map((id, index) =>
        prisma.category.update({
          where: { id },
          data: { priority: index },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
