import { Sparkles } from "lucide-react";
import { Suspense } from "react";
import ServicesContent from "@/components/services/ServicesContent";

function LoadingFallback() {
  return (
    <section className="page-shell mt-20">
      <div className="space-y-8">
        <div className="h-12 bg-slate-200 rounded-lg animate-pulse w-1/3" />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-[450px] rounded-[3rem] bg-slate-200 animate-pulse" />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-slate-50/50 pb-32">
      {/* Premium Header */}
      <section className="bg-slate-950 pt-20 pb-40 sm:pt-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[120px] -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] -ml-64 -mb-64" />
        <div className="page-shell relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-500/20 border border-brand-500/30 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-brand-400 mb-8">
                <Sparkles className="w-3.5 h-3.5" />
                Services
            </div>
            <h1 className="display-font text-6xl sm:text-8xl font-black text-white leading-[0.95] tracking-tighter">
                Discover Services
            </h1>
            <p className="mt-8 text-xl text-slate-400 max-w-2xl leading-relaxed font-medium">
                Explore thousands of verified services across Albania. From luxury stays to local street food, find everything you need.
            </p>
          </div>
        </div>
      </section>

      <Suspense fallback={<LoadingFallback />}>
        <ServicesContent />
      </Suspense>
    </main>
  );
}
