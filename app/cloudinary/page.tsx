"use client";

import { CldImage } from "next-cloudinary";

export default function CloudinaryPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-5 sm:p-8">
      <div className="w-full max-w-2xl rounded-[2rem] border border-slate-200 bg-white p-6 text-center shadow-xl sm:p-10">
        <h1 className="mb-6 text-2xl font-black sm:text-4xl">Cloudinary Demo</h1>
        <p className="text-sm text-slate-500 mb-10">
          This sample uses the `next-cloudinary` `CldImage` component.
        </p>
        <div className="mx-auto w-full max-w-md rounded-[2rem] overflow-hidden">
          <CldImage
            src="main-sample"
            width="500"
            height="500"
            alt="Cloudinary sample"
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
    </main>
  );
}
