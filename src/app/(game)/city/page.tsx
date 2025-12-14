import { ArenaButton } from "@/components/game/ArenaButton";

export default function CityPage() {
  return (
    <div className="relative min-h-screen w-full">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/city/city-bg.jpg)" }}
      />

      {/* Dark / soft overlay */}
      <div className="absolute inset-0 bg-black/35 backdrop-blur-[1px]" />

      {/* Action button */}
      <ArenaButton />
    </div>
  );
}
