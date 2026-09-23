import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { connectDB } from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import PostClient from "./PostClient";

// Published posts rarely change after publishing — cache the page and refresh
// it in the background instead of hitting Mongo on every request.
export const revalidate = 300;

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
  // pass serializable post data to the client component
  const safePost = JSON.parse(JSON.stringify(post));

  return <PostClient post={safePost} />;
}
