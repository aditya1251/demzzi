import { prisma } from "@/lib/prisma"
import { RequestStatus } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  const body = await req.json();
  const status = body.status;

  const allowedStatuses = ["NEW", "PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"];
  const normalizedStatus = status?.toUpperCase();

  if (!allowedStatuses.includes(normalizedStatus)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const request = await prisma.request.findFirst({
    where: { id, isDeleted: false },
    include: {
      user: true,
      service: true,
    },
  });

  if (!request) {
    return NextResponse.json({ error: "Request not found or has been deleted" }, { status: 404 });
  }

  const updated = await prisma.request.update({
    where: { id },
    data: { status: normalizedStatus as RequestStatus },
  });

  if (normalizedStatus === "COMPLETED") {
    const existingRevenue = await prisma.revenue.findFirst({
      where: {
        relatedId: updated.id,
        source: "REQUEST",
        isDeleted: false,
      },
    });

    if (!existingRevenue) {
      await prisma.revenue.create({
        data: {
          amount: updated.amount,
          label: `Request: ${updated.serviceName}`,
          note: `Auto-generated from request completion`,
          source: "REQUEST",
          
          relatedId: updated.id,
          userId: updated.userId,
        },
      });
    }
  }

  return NextResponse.json({
    message: "Status updated",
    status: updated.status,
  });
}
