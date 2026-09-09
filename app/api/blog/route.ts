import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { connectDB } from "@/lib/db";
import BlogPost from "@/models/BlogPost";
import { getAuthUser } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { logActivity } from "@/lib/activity";

export async function GET() {
  try {
    await connectDB();
    const posts = await BlogPost.find({ published: true }).sort({ createdAt: -1 }).populate("author", "name").lean();
    return NextResponse.json({ posts });
  } catch (error) {
    return apiError("Failed to load blog posts", 500, error);
  }
}

export async function POST(request: Request) {
  try {
    const auth = await getAuthUser();
    if (!auth || auth.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    await connectDB();
    const title = String(body.title || "").trim();
    const excerpt = String(body.excerpt || "").trim();
    const content = String(body.content || "").trim();

    if (!title || !excerpt || !content) {
      return NextResponse.json({ error: "Title, excerpt, and content are required." }, { status: 400 });
    }

    let slug = slugify(title);
    let counter = 1;
    while (await BlogPost.findOne({ slug })) {
      slug = `${slugify(title)}-${counter++}`;
    }
    const post = await BlogPost.create({
      title,
      slug,
      excerpt,
      content,
      coverImage: body.coverImage,
      author: auth.id,
      published: Boolean(body.published)
    });

    await logActivity({
      type: "blog_created",
      title: "Blog post created",
      description: `${title} was created by admin.`,
      actor: auth.id,
      actorName: auth.name,
      meta: { slug, published: Boolean(body.published) }
    });

    return NextResponse.json({ post });
  } catch (error) {
    return apiError("Blog post failed", 500, error);
  }
}
