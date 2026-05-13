import { notFound } from "next/navigation";
import { getCategoryByValue } from "@/lib/constants";
import { categories } from "@/lib/constants";
import SubcategoryCarousel from "@/components/categories/SubcategoryCarousel";
import Link from "next/link";
import Image from "next/image";

export default function CategoryPage({ params }: { params: { category: string } }) {
  const category = getCategoryByValue(params.category);
  if (!category) notFound();

  return (
    <main className="min-h-screen bg-slate-50/50 pb-20">
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 opacity-60">
          <Image src={category.image} alt={category.label} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-950/60 to-transparent" />
        </div>
        <div className="page-shell relative py-24">
          <p className="text-xs uppercase tracking-[0.4em] text-brand-400">Category</p>
          <h1 className="mt-6 text-5xl font-black tracking-tight sm:text-6xl">{category.label}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-200">Explore the full range of services and experiences under {category.label}. Find the best local providers and book with confidence.</p>
          <div className="mt-10 flex flex-wrap gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.value}
                href={`/categories/${cat.value}`}
                className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="page-shell py-16">
        <SubcategoryCarousel category={category} />
      </div>
    </main>
  );
}
