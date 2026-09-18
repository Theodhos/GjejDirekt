"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

export default function ReviewPanel({ listingId }: { listingId: string }) {
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/reviews?listingId=${listingId}`)
      .then((res) => res.json())
      .then((data) => setReviews(data.reviews || []))
      .catch(() => undefined);
  }, [listingId]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, listingId })
    });
    const data = await response.json();
    if (!response.ok) {
      toast.error(data.error || "Review failed");
      return;
    }
    toast.success("Review posted");
    setReviews((current) => [data.review, ...current]);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-950">Reviews</h3>
        {reviews.length ? (
          reviews.map((review) => (
            <div key={review._id} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold">{review.user?.name || "Guest"}</p>
                <p className="text-sm text-amber-600">{review.rating}/5</p>
              </div>
              <p className="mt-2 text-sm text-slate-600">{review.comment}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500">No reviews yet.</p>
        )}
      </div>
      <form onSubmit={submit} className="space-y-4 rounded-[1.75rem] border border-slate-200 bg-white p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <Input name="rating" type="number" min="1" max="5" label="Rating" placeholder="5" required />
        </div>
        <Textarea name="comment" label="Comment" placeholder="Share your experience..." required />
        <Button type="submit">Post review</Button>
      </form>
    </div>
  );
}
