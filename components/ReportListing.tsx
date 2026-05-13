"use client";

import { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
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

      toast.success(language === 'en' ? "Report submitted successfully" : "Raporti u dërgua me sukses");
      setIsOpen(false);
      setReason("");
    } catch (error) {
      toast.error(language === 'en' ? "Error submitting report" : "Gabim gjatë dërgimit të raportit");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-2 py-4 text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors"
      >
        <AlertTriangle className="w-3.5 h-3.5" />
        {language === 'en' ? 'Report this post' : 'Raporto këtë postim'}
      </button>
    );
  }

  return (
    <div className="bg-red-50 p-6 rounded-[2rem] border border-red-100 animate-in fade-in zoom-in duration-300">
      <h4 className="text-xs font-black uppercase tracking-widest text-red-950 mb-4 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4" />
        {language === 'en' ? 'Report Post' : 'Raporto Postimin'}
      </h4>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          required
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder={language === 'en' ? 'Why are you reporting this?' : 'Pse po e raportoni këtë?'}
          className="w-full h-24 p-4 rounded-xl bg-white border border-red-200 focus:border-red-500 outline-none text-xs font-medium text-slate-900 resize-none"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-grow h-10 bg-red-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-red-700 disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (language === 'en' ? 'Submit' : 'Dërgo')}
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="h-10 px-4 bg-white text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest border border-slate-200 hover:bg-slate-50"
          >
            {language === 'en' ? 'Cancel' : 'Anulo'}
          </button>
        </div>
      </form>
    </div>
  );
}
