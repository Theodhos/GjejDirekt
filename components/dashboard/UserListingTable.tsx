"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Trash2, Edit, Eye, Loader2, User } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { useLanguage } from "@/context/LanguageContext";

export default function UserListingTable({ 
  listings, 
  isAdmin = false 
}: { 
  listings: any[]; 
  isAdmin?: boolean;
}) {
  const { language } = useLanguage();
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, title: string) => {
    const confirmed = window.confirm(
      language === "en"
        ? `Are you sure you want to delete "${title}"?`
        : `A jeni të sigurt që dëshironi të fshini "${title}"?`
    );
    if (!confirmed) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/listings/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(
          language === "en"
            ? "Listing deleted successfully!"
            : "Shërbimi u fshi me sukses!"
        );
        router.refresh();
      } else {
        toast.error(data.error || "Failed to delete listing");
      }
    } catch (err) {
      toast.error("An error occurred during deletion");
    } finally {
      setDeletingId(null);
    }
  };

  if (!listings.length) {
    return (
      <p className="text-sm font-medium text-slate-500 italic py-8 text-center bg-white rounded-[2rem] border border-slate-100">
        {language === "en"
          ? "No listings yet. Add your first listing to get started."
          : "Nuk ka ende asnjë shërbim të regjistruar."}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mobile Card Layout */}
      <div className="sm:hidden space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-1">
        {listings.map((listing) => (
          <div 
            key={listing._id} 
            className="rounded-2xl p-5"
            style={{
              background: "var(--surface-white)",
              border: "1px solid var(--border-soft)",
              boxShadow: "var(--shadow-card)"
            }}
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-base font-bold mb-1" style={{ color: "var(--text-primary)" }}>{listing.title}</p>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "var(--text-secondary)" }}>{listing.location}</p>
                  {isAdmin && listing.owner && (
                    <div 
                      className="flex items-center gap-1.5 mt-3 text-[11px] font-semibold uppercase tracking-wider rounded-lg px-2.5 py-1 w-fit"
                      style={{ background: "var(--surface-cream)", color: "var(--text-tertiary)", border: "1px solid var(--border-soft)" }}
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>{listing.owner.name || listing.owner.email}</span>
                    </div>
                  )}
                </div>
                <Badge
                  tone={
                    listing.status === "approved"
                      ? "success"
                      : listing.status === "rejected"
                      ? "danger"
                      : "warning"
                  }
                >
                  {listing.status}
                </Badge>
              </div>
              
              <div className="flex flex-wrap items-center gap-2 pt-4 mt-1" style={{ borderTop: "1px solid var(--border-soft)" }}>
                <Link
                  href={`/listings/${listing.slug}/edit`}
                  className="rounded-xl px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-2 flex-1 transition-colors"
                  style={{ background: "var(--surface-cream)", color: "var(--text-secondary)", border: "1px solid var(--border-soft)" }}
                >
                  <Edit className="w-3.5 h-3.5" />
                  {language === "en" ? "Edit" : "Modifiko"}
                </Link>
                <Link
                  href={`/listings/${listing.slug}`}
                  className="rounded-xl px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-2 flex-1 transition-colors"
                  style={{ background: "var(--surface-cream)", color: "var(--text-secondary)", border: "1px solid var(--border-soft)" }}
                >
                  <Eye className="w-3.5 h-3.5" />
                  {language === "en" ? "View" : "Shiko"}
                </Link>
                <button
                  disabled={deletingId === listing._id}
                  onClick={() => handleDelete(listing._id, listing.title)}
                  className="rounded-xl px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-2 shrink-0 transition-colors disabled:opacity-50"
                  style={{ background: "#FEE2E2", color: "#DC2626", border: "1px solid #FECACA" }}
                >
                  {deletingId === listing._id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop List Layout */}
      <div 
        className="hidden sm:block overflow-hidden rounded-2xl"
        style={{
          background: "var(--surface-white)",
          border: "1px solid var(--border-soft)",
          boxShadow: "var(--shadow-card)"
        }}
      >
        <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
          <ul className="divide-y" style={{ borderColor: "var(--border-soft)" }}>
            {/* Header Row */}
            <li 
              className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between text-xs uppercase tracking-[0.15em] font-bold"
              style={{ background: "var(--surface-cream)", color: "var(--text-tertiary)", borderBottom: "1px solid var(--border-soft)" }}
            >
              <div className="flex-1 min-w-[200px]">{language === "en" ? "Title" : "Titulli"}</div>
              {isAdmin && <div className="w-[180px]">{language === "en" ? "Owner" : "Pronari"}</div>}
              <div className="w-[120px]">{language === "en" ? "Status" : "Statusi"}</div>
              <div className="w-[140px]">{language === "en" ? "Location" : "Vendndodhja"}</div>
              <div className="w-[140px] text-right">{language === "en" ? "Actions" : "Veprimet"}</div>
            </li>

            {/* List Items */}
            {listings.map((listing) => (
              <li 
                key={listing._id} 
                className="px-6 py-4 flex items-center justify-between gap-4 transition-colors hover:bg-neutral-50/50"
              >
                {/* Title */}
                <div className="flex-1 min-w-[200px]">
                  <p className="font-bold text-base truncate pr-4" style={{ color: "var(--text-primary)" }}>
                    {listing.title}
                  </p>
                </div>

                {/* Owner (Admin only) */}
                {isAdmin && (
                  <div className="w-[180px] flex flex-col truncate pr-2">
                    <span className="font-semibold text-sm truncate" style={{ color: "var(--text-primary)" }}>
                      {listing.owner?.name || "N/A"}
                    </span>
                    <span className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>
                      {listing.owner?.email || ""}
                    </span>
                  </div>
                )}

                {/* Status */}
                <div className="w-[120px]">
                  <Badge
                    tone={
                      listing.status === "approved"
                        ? "success"
                        : listing.status === "rejected"
                        ? "danger"
                        : "warning"
                    }
                  >
                    {listing.status}
                  </Badge>
                </div>

                {/* Location */}
                <div className="w-[140px]">
                  <span className="text-xs font-semibold uppercase tracking-wider truncate block" style={{ color: "var(--text-secondary)" }}>
                    {listing.location}
                  </span>
                </div>

                {/* Actions */}
                <div className="w-[140px] flex items-center justify-end gap-2">
                  <Link 
                    href={`/listings/${listing.slug}/edit`} 
                    className="flex items-center justify-center h-9 w-9 rounded-xl transition-colors hover:bg-neutral-100"
                    style={{ border: "1px solid var(--border-medium)", color: "var(--text-secondary)" }}
                    title={language === "en" ? "Edit Listing" : "Modifiko Shërbimin"}
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <Link 
                    href={`/listings/${listing.slug}`} 
                    className="flex items-center justify-center h-9 w-9 rounded-xl transition-colors hover:bg-neutral-100"
                    style={{ border: "1px solid var(--border-medium)", color: "var(--text-secondary)" }}
                    title={language === "en" ? "View Listing" : "Shiko Shërbimin"}
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <button
                    disabled={deletingId === listing._id}
                    onClick={() => handleDelete(listing._id, listing.title)}
                    className="flex items-center justify-center h-9 w-9 rounded-xl transition-colors disabled:opacity-50"
                    style={{ background: "#FEE2E2", color: "#DC2626", border: "1px solid #FECACA" }}
                    title={language === "en" ? "Delete Listing" : "Fshi Shërbimin"}
                  >
                    {deletingId === listing._id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
