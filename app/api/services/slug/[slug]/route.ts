// app/api/services/[slug]/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const { slug } = params;
  const service = await prisma.service.findUnique({
    where: { slug },
    include: {
      servvicePageDetails: { include: { content: true } },
      formFields: true,
    },
  });

  if (!service) return new NextResponse("Not found", { status: 404 });

  // Normalize
  const page = service.servvicePageDetails?.[0] ?? null;
  const sections = (page?.content || []).sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));

  return NextResponse.json({
    service: {
      id: service.id,
      title: service.title,
      slug: service.slug,
      description: service.description,
      imageUrl: service.imageUrl,
      price: service.price,
      timeline: service.timeline,
      features: service.features,
    },
    formFields: service.formFields,
    sections,
  });
}
