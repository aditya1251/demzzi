// app/services/[slug]/page.tsx
import { prisma } from "@/lib/prisma";
import ServicePageClient from "./ServicePageClient";

export const revalidate = 30; // ISR-ish, adjust as needed

type Props = {
  params: { slug: string };
};

export default async function Page({ params }: Props) {
  const { slug } = params;

  // Find by slug (or fallback to id if you use id in routes)
  const service = await prisma.service.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      imageUrl: true,
      features: true,
      timeline: true,
      price: true,
      servvicePageDetails: {
        include: { content: true },
      },
      formFields: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-xl">Service not found</h2>
      </div>
    );
  }

  // normalize content sections (could be empty array)
  const pageDetails = service.servvicePageDetails?.[0] ?? null;
  const sections = (pageDetails?.content ?? []).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  // pass to client component
  return (
    <ServicePageClient
      service={{
        id: service.id,
        title: service.title,
        // @ts-ignore - we'll fix this in the client component
        slug: service.slug,
        description: service.description,
        //@ts-ignore - we'll fix this in the client component
        imageUrl: service.imageUrl,
        price: service.price,
        timeline: service.timeline,
        features: service.features || [],
      }}
      sections={sections}
      formFields={service.formFields || []}
    />
  );
}
