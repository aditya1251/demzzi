import { useEffect } from "react";

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 1500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="h-screen bg-[#F6FFEA] relative overflow-hidden">
      {/* Desktop splash */}
      <img
        src="/Landing-desktop.jpg"
        alt="Landing Page"
        className="absolute top-0 left-0 w-full h-full object-contain hidden md:block"
      />
      {/* Mobile splash */}
      <img
        src="/Landing-mobile.jpg"
        alt="Landing Page"
        className="absolute top-0 left-0 w-full h-full object-cover block md:hidden"
      />
    </div>
  );
}
