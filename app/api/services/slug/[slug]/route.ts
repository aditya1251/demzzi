// app/api/services/[slug]/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  const service = await prisma.service.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      imageUrl: true,
      price: true,
      timeline: true,
      features: true,
      servvicePageDetails: {
        include: { content: true },
      },
      formFields: { orderBy: { order: "asc" } },
    },
  });

  if (!service) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const pageDetails = service.servvicePageDetails?.[0] ?? null;
  const sections = (pageDetails?.content ?? []).sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );

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
    sections,
    formFields: service.formFields,
  },{
    headers: {
      "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
    },
  });
}
