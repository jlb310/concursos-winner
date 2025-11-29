import GiveawayApp from "@/components/GiveawayApp";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-[128px] pointer-events-none" />

      <div className="relative z-10 w-full">
        <GiveawayApp />
      </div>
    </main>
  );
}
