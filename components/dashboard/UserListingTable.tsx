import Link from "next/link";
import Badge from "@/components/ui/Badge";

export default function UserListingTable({ listings }: { listings: any[] }) {
  if (!listings.length) {
    return <p className="text-sm text-slate-500">No listings yet. Add your first listing to get started.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="sm:hidden space-y-4">
        {listings.map((listing) => (
          <div key={listing._id} className="surface rounded-[1.75rem] border border-slate-200 p-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-base font-semibold text-slate-950">{listing.title}</p>
                  <p className="text-sm text-slate-500 mt-1">{listing.location}</p>
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
              <div className="flex flex-wrap gap-2 pt-3">
                <Link
                  href={`/listings/${listing.slug}/edit`}
                  className="rounded-full border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-semibold text-brand-700"
                >
                  Edit
                </Link>
                <Link
                  href={`/listings/${listing.slug}`}
                  className="rounded-full border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-semibold text-brand-700"
                >
                  View
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden sm:block surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[760px] w-full divide-y divide-slate-200">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Edit</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {listings.map((listing) => (
                <tr key={listing._id}>
                  <td className="px-4 py-3 font-medium text-slate-950">{listing.title}</td>
                  <td className="px-4 py-3">
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
                  <td className="px-4 py-3 text-sm text-slate-600">{listing.location}</td>
                  <td className="px-4 py-3 text-sm">
                    <Link href={`/listings/${listing.slug}/edit`} className="font-semibold text-brand-700">
                      Edit
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/listings/${listing.slug}`} className="text-sm font-semibold text-brand-700">
                      View
                    </Link>
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
