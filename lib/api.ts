import { NextResponse } from "next/server";

/**
 * Standard error response for API routes.
 *
 * Route handlers used to return `error.message` straight to the client, which
 * leaked mongoose internals (model names, schema paths) on any unexpected
 * failure. Use this instead: the caller gets a stable, human-readable message
 * while the real error is logged server-side.
 */
export function apiError(message: string, status: number, cause?: unknown) {
  if (cause) {
    console.error(`[api ${status}] ${message}:`, cause);
  }
  return NextResponse.json({ error: message }, { status });
}
