import bcrypt from "bcryptjs";
import User from "@/models/User";

let bootstrapPromise: Promise<void> | null = null;

function getAdminPhone(email: string) {
  return process.env.ADMIN_PHONE?.trim() || `admin-${email}`;
}

export async function ensureDefaultAdminAccount() {
  if (bootstrapPromise) return bootstrapPromise;

  bootstrapPromise = (async () => {
    const email = process.env.ADMIN_EMAIL?.toLowerCase().trim();
    const password = process.env.ADMIN_PASSWORD?.trim();
    const name = process.env.ADMIN_NAME?.trim() || "Platform Admin";

    if (!email || !password) return;

    const existing = await User.findOne({ email }).select("+password");
    const hash = await bcrypt.hash(password, 12);

    if (existing) {
      existing.role = "admin";
      existing.name = name;
      existing.password = hash;
      if (!existing.phone) {
        existing.phone = getAdminPhone(email);
      }
      await existing.save();
      return;
    }

    await User.create({
      name,
      email,
      phone: getAdminPhone(email),
      password: hash,
      role: "admin"
    });
  })();

  return bootstrapPromise;
}
