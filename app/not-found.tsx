import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="page-shell flex min-h-[60vh] items-center justify-center py-12 text-center sm:py-20">
      <div className="surface max-w-xl p-6 sm:p-8">
        <p className="eyebrow">404</p>
        <h1 className="mt-3 text-4xl font-black text-slate-950">Page not found</h1>
        <p className="mt-3 text-slate-600">The page you are looking for does not exist or is no longer available.</p>
        <div className="mt-6">
          <Button href="/">Back home</Button>
        </div>
      </div>
    </section>
  );
}
