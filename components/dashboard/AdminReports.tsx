"use client";

import { useState } from "react";
import { Trash2, CheckCircle, ExternalLink, User, AlertCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function AdminReports({ reports: initialReports }: { reports: any[] }) {
  const [reports, setReports] = useState(initialReports);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleDeleteListing = async (listingId: string, reportId: string) => {
    if (!confirm("Are you sure you want to delete this listing? This action cannot be undone.")) return;
    
    setLoadingId(reportId);
    try {
      const response = await fetch(`/api/admin/listings/${listingId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete listing");
      
      // Mark report as resolved
      await fetch(`/api/admin/reports/${reportId}`, { 
        method: "PATCH", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "resolved" })
      });

      toast.success("Listing deleted and report resolved");
      setReports(prev => prev.filter(r => r._id !== reportId));
    } catch (error) {
      toast.error("Error deleting listing");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDismissReport = async (reportId: string) => {
    setLoadingId(reportId);
    try {
      const response = await fetch(`/api/admin/reports/${reportId}`, { 
        method: "PATCH", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "reviewed" })
      });
      if (!response.ok) throw new Error("Failed to dismiss report");

      toast.success("Report dismissed");
      setReports(prev => prev.filter(r => r._id !== reportId));
    } catch (error) {
      toast.error("Error dismissing report");
    } finally {
      setLoadingId(null);
    }
  };

  if (reports.length === 0) {
    return (
      <div className="py-20 text-center">
        <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4 opacity-20" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No pending reports</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <div key={report._id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm group hover:border-red-200 transition-all">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 flex-grow">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-[10px] font-black uppercase tracking-widest">Reported</span>
                <span className="text-slate-400 text-xs font-medium">
                  {new Date(report.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex items-start gap-4">
                 <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                    <AlertCircle className="w-5 h-5" />
                 </div>
                 <div className="flex-grow">
                    <h4 className="text-slate-900 font-black text-base mb-2 group-hover:text-red-600 transition-colors">
                      {report.listing?.title || "Deleted listing"}
                    </h4>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Reason for report:</p>
                      <p className="text-slate-700 text-sm font-bold leading-relaxed">
                        "{report.reason}"
                      </p>
                    </div>
                 </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                 <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-brand-600" />
                    <span className="text-[10px] font-black text-slate-950 uppercase tracking-widest">
                      By {report.reporter?.name || report.reporter?.email || "Unknown"}
                    </span>
                 </div>
                 {report.listing?.slug && (
                    <Link 
                      href={`/listings/${report.listing.slug}`}
                      target="_blank"
                      className="flex items-center gap-1 text-[10px] font-black text-brand-600 uppercase tracking-widest hover:underline"
                    >
                      View Post <ExternalLink className="w-3 h-3" />
                    </Link>
                 )}
              </div>
            </div>

            <div className="flex items-center gap-3 lg:border-l lg:pl-6 border-slate-100">
               <button 
                onClick={() => handleDeleteListing(report.listing?._id, report._id)}
                disabled={loadingId === report._id || !report.listing}
                className="h-12 px-6 bg-red-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-700 shadow-lg shadow-red-600/20 disabled:opacity-50 transition-all flex items-center gap-2"
               >
                 {loadingId === report._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                 Delete Post
               </button>
               <button 
                onClick={() => handleDismissReport(report._id)}
                disabled={loadingId === report._id}
                className="h-12 px-6 bg-slate-100 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all"
               >
                 Dismiss
               </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
