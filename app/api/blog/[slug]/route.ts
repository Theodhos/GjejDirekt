import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { connectDB } from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import { requireAdmin } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { slugify } from "@/lib/utils";

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  try {
    await connectDB();
    const post = await BlogPost.findOne({ slug: params.slug, published: true }).populate("author", "name").lean();
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
    return NextResponse.json({ post });
  } catch (error) {
    return apiError("Failed to load blog post", 500, error);
  }
}

export async function PUT(request: Request, { params }: { params: { slug: string } }) {
  try {
    const admin = await requireAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    await connectDB();

    const post = await BlogPost.findOne({ slug: params.slug });
    if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

    const title = String(body.title || "").trim();
    const excerpt = String(body.excerpt || "").trim();
    const content = String(body.content || "").trim();
    const coverImage = String(body.coverImage || "").trim();

    if (!title || !excerpt || !content) {
      return NextResponse.json({ error: "Title, excerpt, and content are required." }, { status: 400 });
    }

    let nextSlug = post.slug;
    if (title !== post.title) {
      const baseSlug = slugify(title);
      nextSlug = baseSlug;
      let counter = 1;
      while (await BlogPost.findOne({ slug: nextSlug, _id: { $ne: post._id } })) {
        nextSlug = `${baseSlug}-${counter++}`;
      }
    }

    post.title = title;
    post.slug = nextSlug;
    post.excerpt = excerpt;
    post.content = content;
    post.coverImage = coverImage;
    post.published = Boolean(body.published);
    await post.save();
    await post.populate("author", "name");

    await logActivity({
      type: "blog_updated",
      title: "Blog post updated",
      description: `${title} was updated by admin.`,
      actor: admin.id,
      actorName: admin.name,
      meta: { slug: nextSlug, previousSlug: params.slug, published: post.published }
    });

    return NextResponse.json({ post: JSON.parse(JSON.stringify(post)) });
  } catch (error) {
    return apiError("Blog post update failed", 500, error);
  }
}
