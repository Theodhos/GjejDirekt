"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Trash2, Edit, Eye, Loader2 } from "lucide-react";

type Props = {
  id: string;
  slug: string;
  title: string;
};

export default function AdminListingActions({ id, slug, title }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `A jeni të sigurt që dëshironi të fshini shërbimin "${title}"?`
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/listings/${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Shërbimi u fshi me sukses!");
        router.refresh();
      } else {
        toast.error(data.error || "Fshirja dështoi");
      }
    } catch {
      toast.error("Ndodhi një gabim gjatë fshirjes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Link 
        href={`/listings/${slug}`} 
        className="inline-flex items-center gap-1 text-xs font-black text-slate-600 hover:text-brand-600 transition"
      >
        <Eye className="w-3.5 h-3.5" />
        Shiko
      </Link>
      <Link 
        href={`/listings/${slug}/edit`} 
        className="inline-flex items-center gap-1 text-xs font-black text-slate-800 hover:text-brand-600 transition"
      >
        <Edit className="w-3.5 h-3.5" />
        Modifiko
      </Link>
      <button 
        disabled={loading}
        onClick={handleDelete}
        className="inline-flex items-center gap-1 text-xs font-black text-rose-600 hover:text-rose-700 disabled:opacity-50 transition"
      >
        {loading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Trash2 className="w-3.5 h-3.5" />
        )}
        Fshi
      </button>
    </div>
  );
}
