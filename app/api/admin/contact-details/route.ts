import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const details = await prisma.contactDetails.findFirst();
    return NextResponse.json(details);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch contact details" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, WhatsApp, email } = body;

    const existing = await prisma.contactDetails.findFirst();

    const updated = existing
      ? await prisma.contactDetails.update({
          where: { id: existing.id },
          data: { phone, WhatsApp, email },
        })
      : await prisma.contactDetails.create({
          data: { phone, WhatsApp, email },
        });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update contact details" }, { status: 500 });
  }
}
