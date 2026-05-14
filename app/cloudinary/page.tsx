"use client";

import { CldImage } from "next-cloudinary";

export default function CloudinaryPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
      <div className="w-full max-w-2xl rounded-[2rem] border border-slate-200 bg-white p-10 shadow-xl text-center">
        <h1 className="text-4xl font-black mb-6">Cloudinary Demo</h1>
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
