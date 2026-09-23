"use client";

import dynamic from "next/dynamic";

// Rendered on every route from the root layout. Splitting it into its own chunk
// (instead of inlining it into the shared bundle) trims initial JS parse cost;
// SSR stays on so the toggle button still appears in the server-rendered HTML
// exactly as before — no ssr:false, no visible pop-in after hydration.
const ChatWidget = dynamic(() => import("@/components/ChatWidget"));

export default ChatWidget;
