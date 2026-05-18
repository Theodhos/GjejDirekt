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
      <div className="sm:hidden space-y-4 max-h-[60vh] overflow-y-auto pr-1">
        {listings.map((listing) => (
          <div key={listing._id} className="surface rounded-[1.75rem] border border-slate-200 p-5 bg-white">
            <div className="flex flex-col gap-2">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-base font-black text-slate-950">{listing.title}</p>
                  <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-widest">{listing.location}</p>
                  {isAdmin && listing.owner && (
                    <div className="flex items-center gap-1 mt-2 text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-100 rounded-full px-2 py-0.5 w-fit">
                      <User className="w-3 h-3 text-slate-400" />
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
              
              <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100 mt-2">
                <Link
                  href={`/listings/${listing.slug}/edit`}
                  className="rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 px-4 py-2 text-xs font-black uppercase tracking-wider text-brand-700 flex items-center gap-1.5 transition-all"
                >
                  <Edit className="w-3 h-3" />
                  {language === "en" ? "Edit" : "Modifiko"}
                </Link>
                <Link
                  href={`/listings/${listing.slug}`}
                  className="rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 px-4 py-2 text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5 transition-all"
                >
                  <Eye className="w-3.5 h-3.5" />
                  {language === "en" ? "View" : "Shiko"}
                </Link>
                <button
                  disabled={deletingId === listing._id}
                  onClick={() => handleDelete(listing._id, listing.title)}
                  className="rounded-full border border-red-200 bg-red-50 hover:bg-red-100 px-4 py-2 text-xs font-black uppercase tracking-wider text-red-700 flex items-center gap-1.5 transition-all disabled:opacity-50 ml-auto"
                >
                  {deletingId === listing._id ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Trash2 className="w-3 h-3" />
                  )}
                  {language === "en" ? "Delete" : "Fshi"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden sm:block surface overflow-hidden bg-white border border-slate-150 rounded-[2rem]">
        <div className="max-h-[520px] overflow-y-auto overflow-x-auto">
          <table className="min-w-[760px] w-full divide-y divide-slate-100">
            <thead className="bg-slate-50/75 text-left text-xs uppercase tracking-widest font-black text-slate-500">
              <tr>
                <th className="px-6 py-4 font-black">{language === "en" ? "Title" : "Titulli"}</th>
                {isAdmin && <th className="px-6 py-4 font-black">{language === "en" ? "Owner" : "Pronari"}</th>}
                <th className="px-6 py-4 font-black">{language === "en" ? "Status" : "Statusi"}</th>
                <th className="px-6 py-4 font-black">{language === "en" ? "Location" : "Vendndodhja"}</th>
                <th className="px-6 py-4 font-black text-center">{language === "en" ? "Actions" : "Veprimet"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium">
              {listings.map((listing) => (
                <tr key={listing._id} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4 font-bold text-slate-900">{listing.title}</td>
                  {isAdmin && (
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800">{listing.owner?.name || "N/A"}</span>
                        <span className="text-xs text-slate-400 font-semibold">{listing.owner?.email || ""}</span>
                      </div>
                    </td>
                  )}
                  <td className="px-6 py-4">
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
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-semibold uppercase tracking-wider text-xs">{listing.location}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Link 
                        href={`/listings/${listing.slug}/edit`} 
                        className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-brand-600 transition shadow-sm hover:scale-105"
                        title={language === "en" ? "Edit Listing" : "Modifiko Shërbimin"}
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <Link 
                        href={`/listings/${listing.slug}`} 
                        className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition shadow-sm hover:scale-105"
                        title={language === "en" ? "View Listing" : "Shiko Shërbimin"}
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        disabled={deletingId === listing._id}
                        onClick={() => handleDelete(listing._id, listing.title)}
                        className="p-2 rounded-xl border border-red-150 bg-red-50 hover:bg-red-100 text-red-600 transition shadow-sm hover:scale-105 disabled:opacity-50"
                        title={language === "en" ? "Delete Listing" : "Fshi Shërbimin"}
                      >
                        {deletingId === listing._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
