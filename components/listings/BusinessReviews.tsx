"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import toast from "react-hot-toast";
import { useLanguage } from "@/context/LanguageContext";

type Review = {
  _id: string;
  rating: number;
  comment: string;
  createdAt?: string;
  user?: { name?: string };
};

function Stars({ value, size = 16 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${value} / 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} width={size} height={size} strokeWidth={0} fill={n <= Math.round(value) ? "#F5A524" : "#E5E7EB"} />
      ))}
    </span>
  );
}

/** The Vlerësime tab: the rating summary, everyone's reviews and a form to add one. */
export default function BusinessReviews({
  listingId,
  ratingAverage,
  reviewCount
}: {
  listingId: string;
  ratingAverage: number;
  reviewCount: number;
}) {
  const { language } = useLanguage();
  const en = language === "en";
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/reviews?listingId=${listingId}`)
      .then((res) => res.json())
      .then((data) => !cancelled && setReviews(data.reviews || []))
      .catch(() => !cancelled && setReviews([]));
    return () => {
      cancelled = true;
    };
  }, [listingId]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!comment.trim()) return;
    setSending(true);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId, rating, comment: comment.trim() })
      });
      const data = await response.json();
      if (response.status === 401) {
        toast.error(en ? "Log in to leave a review." : "Identifikohu për të lënë një vlerësim.");
        return;
      }
      if (!response.ok) {
        toast.error(data.error || (en ? "Could not post your review." : "Vlerësimi nuk u dërgua."));
        return;
      }
      toast.success(en ? "Thanks for your review!" : "Faleminderit për vlerësimin!");
      setReviews((current) => [data.review, ...(current || [])]);
      setComment("");
    } catch {
      toast.error(en ? "Network error" : "Gabim rrjeti");
    } finally {
      setSending(false);
    }
  }

  // Once every review is in, the summary is worked out from them so one posted a second
  // ago is counted; otherwise the numbers stored on the listing are shown.
  const loadedAll = Boolean(reviews && reviews.length > 0 && reviews.length >= reviewCount);
  const count = loadedAll ? reviews!.length : Math.max(reviews?.length ?? 0, reviewCount);
  const average = loadedAll ? reviews!.reduce((sum, item) => sum + Number(item.rating || 0), 0) / reviews!.length : ratingAverage;

  return (
    <div className="px-4 py-5 pb-28 lg:grid lg:grid-cols-[380px_minmax(0,1fr)] lg:items-start lg:gap-10 lg:px-0">
      <div className="space-y-6">
        <div className="flex items-center gap-5 rounded-2xl border p-4" style={{ borderColor: "var(--border-soft)" }}>
          <div className="text-center">
            <p className="text-[40px] font-bold leading-none" style={{ color: "var(--text-primary)" }}>
              {count > 0 ? average.toFixed(1) : "–"}
            </p>
            <div className="mt-2">
              <Stars value={count > 0 ? average : 0} />
            </div>
          </div>
          <p className="text-[14px]" style={{ color: "var(--text-secondary)" }}>
            {count > 0
              ? en
                ? `Based on ${count} ${count === 1 ? "review" : "reviews"}`
                : `Bazuar në ${count} vlerësime`
              : en
              ? "No reviews yet — be the first."
              : "Ende pa vlerësime — bëhu i pari."}
          </p>
        </div>

        <form onSubmit={submit} className="space-y-3 rounded-2xl border p-4" style={{ borderColor: "var(--border-soft)" }}>
          <p className="text-[15px] font-bold" style={{ color: "var(--text-primary)" }}>
            {en ? "Leave a review" : "Lër një vlerësim"}
          </p>
          <div className="flex gap-1" role="radiogroup" aria-label={en ? "Rating" : "Vlerësimi"}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={rating === n}
                aria-label={`${n}`}
                onClick={() => setRating(n)}
                className="min-h-0 p-0.5"
              >
                <Star width={28} height={28} strokeWidth={0} fill={n <= rating ? "#F5A524" : "#E5E7EB"} />
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            required
            rows={3}
            placeholder={en ? "Share your experience..." : "Ndaj përvojën tënde..."}
            className="w-full rounded-xl border p-3 text-[14px] outline-none focus:border-[var(--brand-accent)]"
            style={{ borderColor: "var(--border-medium)" }}
          />
          <button
            type="submit"
            disabled={sending || !comment.trim()}
            className="h-11 w-full rounded-xl text-[14px] font-bold text-white transition-opacity disabled:opacity-50"
            style={{ background: "var(--brand-accent)" }}
          >
            {sending ? (en ? "Sending..." : "Duke dërguar...") : en ? "Post review" : "Dërgo vlerësimin"}
          </button>
        </form>
      </div>

      <div className="mt-6 lg:mt-0">
        {reviews === null ? (
          <p className="text-center text-[13px]" style={{ color: "var(--text-tertiary)" }}>
            {en ? "Loading reviews..." : "Duke ngarkuar vlerësimet..."}
          </p>
        ) : (
          <ul className="divide-y" style={{ borderColor: "var(--border-soft)" }}>
            {reviews.map((review) => (
              <li key={review._id} className="py-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[14.5px] font-bold" style={{ color: "var(--text-primary)" }}>
                    {review.user?.name || (en ? "Guest" : "Vizitor")}
                  </p>
                  <Stars value={review.rating} size={14} />
                </div>
                <p className="mt-1.5 text-[13.5px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {review.comment}
                </p>
                {review.createdAt && (
                  <p className="mt-1.5 text-[11.5px]" style={{ color: "var(--text-tertiary)" }}>
                    {new Date(review.createdAt).toLocaleDateString(en ? "en-GB" : "sq-AL", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
