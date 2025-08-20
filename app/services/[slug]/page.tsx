// app/services/[slug]/page.tsx
import ServicePageClient from "./ServicePageClient";

type Props = { params: { slug: string } };

export default function Page({ params }: Props) {
  return <ServicePageClient slug={params.slug} />;
}
