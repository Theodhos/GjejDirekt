"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Edit3, Eye, Loader2, Trash2, User, UtensilsCrossed } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function UserListingTable({
  listings,
  isAdmin = false
}: {
  listings: any[];
  isAdmin?: boolean;
}) {
  const { language } = useLanguage();
  const en = language === "en";
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [localListings, setLocalListings] = useState(listings);

  // Sync state if props change
  useEffect(() => {
    setLocalListings(listings);
  }, [listings]);

  const statusLabels: Record<string, { en: string; al: string }> = {
    approved: { en: "Approved", al: "I miratuar" },
    pending: { en: "Pending", al: "Në pritje" },
    rejected: { en: "Rejected", al: "I refuzuar" }
  };

  const statusStyles: Record<string, { bg: string; color: string; border: string }> = {
    approved: { bg: "#D1FAE5", color: "#047857", border: "#A7F3D0" },
    pending: { bg: "#FEF3C7", color: "#B45309", border: "#FDE68A" },
    rejected: { bg: "#FEE2E2", color: "#DC2626", border: "#FECACA" }
  };

  const handleDelete = async (id: string, title: string) => {
    const confirmed = window.confirm(en ? `Are you sure you want to delete "${title}"?` : `A jeni të sigurt që dëshironi të fshini "${title}"?`);
    if (!confirmed) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/listings/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        toast.success(en ? "Listing deleted successfully!" : "Shërbimi u fshi me sukses!");
        setLocalListings((prev) => prev.filter((item) => item._id !== id));
        router.refresh();
      } else {
        toast.error(data.error || (en ? "Failed to delete listing" : "Fshirja e shërbimit dështoi"));
      }
    } catch {
      toast.error(en ? "An error occurred during deletion" : "Ndodhi një gabim gjatë fshirjes");
    } finally {
      setDeletingId(null);
    }
  };

  if (!localListings.length) {
    return (
      <div
        className="rounded-2xl px-6 py-10 text-center"
        style={{ background: "var(--surface-cream)", border: "1px solid var(--border-soft)" }}
      >
        <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          {en ? "No listings yet." : "Nuk ka ende shërbime."}
        </p>
        <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
          {en ? "Add your first listing to get started." : "Shtoni shërbimin tuaj të parë për të filluar."}
        </p>
      </div>
    );
  }

  return (
    <div
      className="overflow-hidden rounded-2xl"
      style={{
        background: "var(--surface-white)",
        border: "1px solid var(--border-soft)",
      }}
    >
      <div
        className="hidden md:grid grid-cols-[1fr_auto] items-center gap-4 px-6 py-4 text-[11px] font-black uppercase tracking-[0.18em]"
        style={{ background: "var(--surface-cream)", color: "var(--text-tertiary)", borderBottom: "1px solid var(--border-soft)" }}
      >
        <div>{en ? "Listing" : "Shërbimi"}</div>
        <div className="text-right">{en ? "Manage" : "Menaxho"}</div>
          </div>

          <div className="divide-y" style={{ borderColor: "var(--border-soft)" }}>
            {localListings.map((listing) => {
              const status = statusStyles[listing.status] || statusStyles.pending;
          const statusText = statusLabels[listing.status]?.[language] || listing.status;

              return (
                <div
                  key={listing._id}
                  className="grid gap-4 px-5 py-5 md:grid-cols-[1fr_auto] items-center md:px-6"
                >
                  <div className="min-w-0 flex flex-col items-start md:block">
                    <div className="w-full flex justify-between items-start gap-2">
                      <div>
                        <p className="truncate text-base font-black" style={{ color: "var(--text-primary)" }}>
                          {listing.title}
                        </p>
                        <p className="mt-1 line-clamp-1 text-xs font-medium" style={{ color: "var(--text-tertiary)" }}>
                          {listing.category || (en ? "Service listing" : "Listim shërbimi")}
                        </p>
                      </div>
                    </div>
                    {isAdmin && listing.owner && (
                      <div
                        className="mt-3 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold"
                        style={{ background: "var(--surface-cream)", color: "var(--text-tertiary)", border: "1px solid var(--border-soft)" }}
                      >
                        <User className="h-3.5 w-3.5" />
                        <span>{listing.owner.name || listing.owner.email}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 justify-start md:justify-end mt-2 md:mt-0">
                    <Link
                      href={`/listings/${listing.slug}/products`}
                      className="inline-flex h-10 md:h-11 items-center justify-center gap-1.5 sm:gap-2 rounded-xl px-3 sm:px-4 text-[10px] sm:text-xs font-black uppercase tracking-[0.12em] transition-colors hover:bg-neutral-100"
                      style={{ border: "1px solid var(--border-medium)", color: "var(--text-secondary)" }}
                      title={en ? "Manage menu" : "Menaxho menunë"}
                    >
                      <UtensilsCrossed className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span className="hidden xl:inline">{en ? "Menu" : "Menuja"}</span>
                    </Link>
                    <Link
                      href={`/listings/${listing.slug}/edit`}
                      className="inline-flex h-10 md:h-11 items-center justify-center gap-1.5 sm:gap-2 rounded-xl px-3 sm:px-4 text-[10px] sm:text-xs font-black uppercase tracking-[0.12em] text-white transition-all hover:-translate-y-0.5"
                      style={{ background: "var(--brand-accent)", boxShadow: "0 8px 18px rgba(225,29,46,0.22)" }}
                      title={en ? "Edit Listing" : "Modifiko Shërbimin"}
                    >
                      <Edit3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span className="hidden xl:inline">{en ? "Edit" : "Modifiko"}</span>
                    </Link>
                    <Link
                      href={`/listings/${listing.slug}`}
                      className="inline-flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-xl transition-colors hover:bg-neutral-100"
                      style={{ border: "1px solid var(--border-medium)", color: "var(--text-secondary)" }}
                      title={en ? "View Listing" : "Shiko Shërbimin"}
                    >
                      <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Link>
                    <button
                      disabled={deletingId === listing._id}
                      onClick={() => handleDelete(listing._id, listing.title)}
                      className="inline-flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-xl transition-colors disabled:opacity-50"
                      style={{ background: "#FEE2E2", color: "#DC2626", border: "1px solid #FECACA" }}
                      title={en ? "Delete Listing" : "Fshi Shërbimin"}
                    >
                      {deletingId === listing._id ? (
                        <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
    </div>
  );
}
