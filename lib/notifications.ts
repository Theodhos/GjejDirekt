import { connectDB } from "./db";
import Notification, { type NotificationType } from "@/models/Notification";

type CreateNotificationInput = {
  user: string;
  type: NotificationType;
  title: string;
  body?: string;
  listing?: string;
  listingTitle?: string;
  href?: string;
  meta?: Record<string, unknown>;
};

/** Writes one in-app notification. Never throws — a failed ping must not fail the order itself. */
export async function createNotification(input: CreateNotificationInput) {
  try {
    await connectDB();
    await Notification.create(input);
  } catch {
    // Notifications are best-effort.
  }
}
