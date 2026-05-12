"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronDown, ArrowRight, Calendar, User, Sparkles } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/dictionary";
import { useEffect, useState } from "react";

export default function BlogPage() {
    const { language } = useLanguage();
    const t = translations[language];

    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch('/api/blog');
                const data = await res.json();
                setPosts(data.posts || []);
            } catch (error) {
                console.error("Error loading blog posts:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const heroPost = posts[0];

    const blogFallbacks = [
        { slug: "sample-1", title: "Discover the Hidden Gems of the Albanian Riviera", excerpt: "From secret beaches to ancient ruins, explore the best kept secrets of the coast.", createdAt: new Date().toISOString() },
        { slug: "sample-2", title: "A Culinary Journey Through Tirana's Best Eateries", excerpt: "Taste the evolution of Albanian cuisine in the heart of the capital.", createdAt: new Date().toISOString() },
        { slug: "sample-3", title: "Hiking the Accursed Mountains: A Practical Guide", excerpt: "Everything you need to know for a safe and breathtaking mountain adventure.", createdAt: new Date().toISOString() }
    ];

    return (
        <main className="bg-white">
            {/* SECTION 1: CINEMATIC FULL HERO (THE ONE THEY LIKED) */}
            <section className="relative h-[85vh] min-h-[700px] w-full overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src={
                            heroPost?.coverImage ||
                            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=90"
                        }
                        alt={heroPost?.title || "Travel stories"}
                        fill
                        priority
                        className="object-cover transition-transform duration-[10000ms] ease-out scale-110 group-hover:scale-100"
                        style={{
                            animation: 'kenburns 40s infinite alternate'
                        }}
                    />
                </div>

                {/* Dark overlay for readability */}
                <div className="absolute inset-0 z-10 bg-gradient-to-b from-slate-950/60 via-slate-950/20 to-slate-950/90" />

                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center text-white">
                    <div className="max-w-5xl">
                        <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-brand-500/20 border border-brand-500/30 backdrop-blur-md px-6 py-2 text-xs font-black uppercase tracking-[0.4em] text-brand-400 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <Sparkles className="w-4 h-4" />
                            {language === 'en' ? 'The Journal' : 'Revista'}
                        </div>

                        <h1 className="display-font text-6xl font-black leading-[1.05] tracking-tighter sm:text-8xl lg:text-9xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
                            {language === 'en' ? 'Stories that' : 'Histori që'} <br />
                            <span className="italic font-light text-slate-300">
                                {language === 'en' ? 'Inspire' : 'Inspirojnë'}
                            </span>
                        </h1>

                        <p className="mx-auto mt-12 max-w-2xl text-lg text-slate-200 sm:text-2xl font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1200">
                            {t.blog.heroDesc}
                        </p>

                        <div className="mt-16 flex flex-wrap justify-center gap-6 animate-in fade-in slide-in-from-bottom-16 duration-1500">
                            <button
                                onClick={() => window.scrollTo({ top: window.innerHeight * 0.8, behavior: 'smooth' })}
                                className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-white transition hover:bg-white/10 hover:border-white/40"
                            >
                                <ChevronDown className="h-6 w-6 animate-bounce" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* CSS Animation for the background */}
                <style jsx>{`
            @keyframes kenburns {
                from { transform: scale(1); }
                to { transform: scale(1.15); }
            }
        `}</style>
            </section>

            {/* SECTION 2: ARTICLES GRID */}
            <section className="bg-slate-50 py-24 sm:py-32">
                <div className="page-shell">
                    <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <p className="text-xs uppercase tracking-[0.3em] font-black text-brand-700 mb-4">{t.blog.archiveTitle}</p>
                            <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-950">
                                {t.blog.latestPub}
                            </h2>
                        </div>
                    </div>

                    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                        {(loading ? Array.from({ length: 3 }) : (posts.length > 0 ? posts : blogFallbacks)).map((post: any, idx) => (
                            <article key={idx} className="group flex flex-col bg-white rounded-[3rem] overflow-hidden border border-slate-200 transition-all duration-500 hover:-translate-y-4 hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)]">
                                {loading ? (
                                    <div className="aspect-[4/3] bg-slate-200 animate-pulse" />
                                ) : (
                                    <Link href={`/blog/${post.slug}`} className="relative aspect-[4/3] overflow-hidden">
                                        <Image
                                            src={post.coverImage || "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80"}
                                            alt={post.title}
                                            fill
                                            className="object-cover transition duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-slate-950/20 transition-opacity group-hover:opacity-0" />
                                    </Link>
                                )}
                                <div className="p-10 flex flex-col flex-grow">
                                    {loading ? (
                                        <div className="space-y-4">
                                            <div className="h-4 bg-slate-100 w-1/2 animate-pulse" />
                                            <div className="h-8 bg-slate-100 w-full animate-pulse" />
                                            <div className="h-24 bg-slate-100 w-full animate-pulse" />
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex items-center gap-4 text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6">
                                                <span className="flex items-center gap-2">
                                                    <Calendar className="w-3.5 h-3.5 text-brand-600" />
                                                    {post.createdAt ? new Date(post.createdAt).toLocaleDateString(language === 'en' ? 'en-US' : 'sq-AL', { month: 'short', day: 'numeric', year: 'numeric' }) : "Recently"}
                                                </span>
                                                <span className="flex items-center gap-2">
                                                    <User className="w-3.5 h-3.5 text-brand-600" />
                                                    {post.author?.name || "Editor"}
                                                </span>
                                            </div>
                                            <h3 className="text-3xl font-black text-slate-950 mb-6 line-clamp-2 leading-tight group-hover:text-brand-700 transition duration-300">
                                                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                                            </h3>
                                            <p className="text-slate-500 text-base leading-relaxed line-clamp-3 mb-10">
                                                {post.excerpt}
                                            </p>
                                            <div className="mt-auto pt-8 border-t border-slate-100">
                                                <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-3 text-sm font-black text-slate-950 transition-all hover:gap-6 group-hover:text-brand-700">
                                                    {language === 'en' ? 'Explore Story' : 'Eksploro Historinë'}
                                                    <ArrowRight className="w-5 h-5" />
                                                </Link>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>

                    <div className="mt-24 flex justify-center">
                        <button className="inline-flex items-center gap-4 rounded-full bg-slate-950 px-16 py-6 text-sm font-black text-white transition hover:bg-brand-500 hover:scale-105 active:scale-95 shadow-2xl">
                            {t.blog.loadMore}
                            <ChevronDown className="w-5 h-5 animate-bounce" />
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
}
