"use client";

import { useState } from "react";
import { Flag, Loader2, X, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import { useLanguage } from "@/context/LanguageContext";

export default function ReportListing({ listingId }: { listingId: string }) {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/listings/${listingId}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason })
      });

      if (!response.ok) throw new Error("Failed to submit report");

      toast.success(language === "en" ? "Report submitted successfully" : "Raporti u dërgua me sukses");
      setIsOpen(false);
      setReason("");
    } catch {
      toast.error(language === "en" ? "Error submitting report" : "Gabim gjatë dërgimit të raportit");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="group w-full flex items-center justify-center gap-2.5 rounded-xl py-3 px-4 text-sm font-semibold transition-all duration-200"
        style={{
          background: "rgba(239,68,68,0.06)",
          border: "1px solid rgba(239,68,68,0.2)",
          color: "#dc2626"
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.12)";
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(239,68,68,0.35)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.06)";
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(239,68,68,0.2)";
        }}
      >
        <Flag className="w-4 h-4" />
        {language === "en" ? "Report this listing" : "Raporto këtë postim"}
      </button>
    );
  }

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: "1px solid rgba(239,68,68,0.25)", background: "rgba(239,68,68,0.04)" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: "1px solid rgba(239,68,68,0.15)", background: "rgba(239,68,68,0.07)" }}
      >
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" style={{ color: "#dc2626" }} />
          <span className="text-sm font-semibold" style={{ color: "#dc2626" }}>
            {language === "en" ? "Report Listing" : "Raporto Postimin"}
          </span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors hover:bg-red-100"
          style={{ color: "#dc2626" }}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-4 space-y-3">
        <textarea
          required
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder={language === "en" ? "Describe the issue…" : "Përshkruani problemin…"}
          className="w-full h-24 p-3 text-sm rounded-xl outline-none resize-none transition-all"
          style={{
            background: "var(--surface-white)",
            border: "1px solid rgba(239,68,68,0.25)",
            color: "var(--text-primary)"
          }}
          onFocus={e => (e.currentTarget.style.borderColor = "rgba(239,68,68,0.5)")}
          onBlur={e => (e.currentTarget.style.borderColor = "rgba(239,68,68,0.25)")}
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="flex flex-1 h-9 items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: "#dc2626" }}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              language === "en" ? "Submit Report" : "Dërgo Raportin"
            )}
          </button>
          <button
            type="button"
            onClick={() => { setIsOpen(false); setReason(""); }}
            className="h-9 px-4 rounded-xl text-sm font-medium transition-colors hover:bg-neutral-100"
            style={{ background: "var(--surface-white)", border: "1px solid var(--border-medium)", color: "var(--text-secondary)" }}
          >
            {language === "en" ? "Cancel" : "Anulo"}
          </button>
        </div>
      </form>
    </div>
  );
}
