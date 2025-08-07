import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const details = await prisma.contactDetails.findFirst();
    return NextResponse.json(details);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch contact details" }, { status: 500 });
  }
}
