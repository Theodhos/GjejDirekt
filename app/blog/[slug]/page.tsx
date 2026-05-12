import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CalendarDays, UserRound, ArrowLeft, Share2, Bookmark } from "lucide-react";
import { connectDB } from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import Link from "next/link";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  await connectDB();
  const post = await BlogPost.findOne({ slug: params.slug, published: true }).lean<any>();
  if (!post) return {};

  return {
    title: `${post.title} | Tourism Platform`,
    description: post.excerpt.slice(0, 160)
  };
}

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  await connectDB();
  const post = await BlogPost.findOne({ slug: params.slug, published: true }).populate("author", "name").lean<any>();
  if (!post) notFound();

  const image = post.coverImage || "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=2000&q=80";

  return (
    <main className="bg-white min-h-screen">
      {/* 1. Header Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 py-6">
        <div className="page-shell max-w-5xl mx-auto flex items-center justify-between">
            <Link href="/blog" className="inline-flex items-center gap-3 text-slate-900 hover:text-brand-600 transition font-black text-xs uppercase tracking-widest">
                <ArrowLeft className="w-5 h-5" /> All Stories
            </Link>
            <div className="flex gap-4">
                <button className="p-3 rounded-full hover:bg-slate-50 transition text-slate-400 hover:text-slate-950">
                    <Share2 className="w-5 h-5" />
                </button>
                <button className="p-3 rounded-full hover:bg-slate-50 transition text-slate-400 hover:text-slate-950">
                    <Bookmark className="w-5 h-5" />
                </button>
            </div>
        </div>
      </nav>

      <article className="pb-32">
        {/* 2. Title Section */}
        <header className="page-shell max-w-4xl mx-auto pt-20 pb-16 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.4em] text-white mb-10">
                Journal Entry
            </div>
            <h1 className="display-font text-5xl sm:text-7xl lg:text-8xl font-black text-slate-950 leading-[0.95] tracking-tighter mb-10">
                {post.title}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-8 text-slate-400">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-900 border border-slate-100">
                        <UserRound className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-slate-900">{post.author?.name || "Editorial Team"}</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-900 border border-slate-100">
                        <CalendarDays className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-slate-900">{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
        </header>

        {/* 3. Main Hero Image */}
        <div className="page-shell max-w-6xl mx-auto mb-20">
            <div className="relative aspect-[21/9] rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)]">
                <Image src={image} alt={post.title} fill className="object-cover" priority />
            </div>
        </div>

        {/* 4. Simple, Clear Content Area */}
        <div className="page-shell max-w-3xl mx-auto">
            <div className="mb-16">
                <p className="text-2xl sm:text-3xl font-medium text-slate-600 leading-relaxed italic border-l-8 border-brand-500 pl-10 py-2">
                    {post.excerpt}
                </p>
            </div>

            <div className="prose prose-slate prose-xl max-w-none">
                <div className="whitespace-pre-line text-xl leading-relaxed text-slate-800 font-medium">
                    {post.content}
                </div>
            </div>

            {/* Footer Discover */}
            <div className="mt-32 p-12 rounded-[3rem] bg-slate-50 border border-slate-100 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                <h4 className="text-3xl font-black text-slate-950 mb-6 relative z-10">Inspired by this story?</h4>
                <p className="text-slate-500 text-lg mb-10 max-w-md mx-auto font-medium relative z-10">Discover verified services and start planning your own Albanian adventure today.</p>
                <Link href="/services" className="inline-flex items-center gap-4 px-12 py-5 bg-slate-950 text-white rounded-full font-black text-sm hover:bg-brand-600 transition shadow-2xl relative z-10">
                    Explore Marketplace <ArrowRight className="w-5 h-5" />
                </Link>
            </div>
        </div>
      </article>

    </main>
  );
}
