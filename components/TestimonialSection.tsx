"use client";

import { Star, Quote } from "lucide-react";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string; // alias for `review`
}

// ✅ register modules with SwiperCore
SwiperCore.use([Autoplay, Pagination, Navigation]);

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reviews")
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((r: any) => ({
          id: r.id,
          name: r.name,
          role: r.role,
          quote: r.review,
        }));
        setTestimonials(formatted);
      })
      .catch(() => setTestimonials([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="bg-[#f6fbf4] px-4 lg:px-6 py-12">
        <p className="text-center text-gray-500">Loading testimonials...</p>
      </section>
    );
  }

  if (!testimonials.length) {
    return (
      <section className="bg-[#f6fbf4] px-4 lg:px-6 py-12">
        <p className="text-center text-gray-400">No testimonials available.</p>
      </section>
    );
  }

  return (
    <section className="bg-[#f6fbf4] px-4 lg:px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl lg:text-4xl font-bold text-green-800 mb-12 text-center">
          What Our Clients Say
        </h2>

        <Swiper
          spaceBetween={30}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-12"
        >
          {testimonials.map((t) => (
            <SwiperSlide key={t.id} className="h-full flex">
              <TestimonialCard {...t} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

function TestimonialCard({
  name,
  role,
  quote,
}: {
  name: string;
  role: string;
  quote: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition p-6 border border-gray-100 h-full flex flex-col">
      {/* Stars */}
      <div
        className="flex items-center mb-4 space-x-1 text-yellow-500"
        aria-label="5 star review"
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className="w-5 h-5 fill-yellow-400 stroke-yellow-500"
          />
        ))}
      </div>

      {/* Quote with decorative mark */}
      <div className="relative flex-1">
        <Quote className="absolute -top-3 -left-2 w-6 h-6 text-green-100" />
        <p className="text-gray-700 italic mb-4 line-clamp-4 leading-relaxed pl-6">
          “{quote}”
        </p>
      </div>

      {/* User info */}
      <div className="flex items-center space-x-3 mt-auto pt-4 border-t border-gray-100">
        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
          {name.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-green-900">{name}</p>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>
    </div>
  );
}
