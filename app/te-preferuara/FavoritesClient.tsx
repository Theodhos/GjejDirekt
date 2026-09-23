"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import BusinessCard from "@/components/home/BusinessCard";
import { useLanguage } from "@/context/LanguageContext";
import PageHeader from "@/components/layout/PageHeader";
import EmptyState from "@/components/ui/EmptyState";

export default function FavoritesClient() {
  const { language } = useLanguage();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "signed-out">("loading");

  useEffect(() => {
    fetch("/api/favorites", { cache: "no-store" })
      .then(async (res) => {
        if (res.status === 401) {
          setState("signed-out");
          return;
        }
        const data = await res.json();
        setFavorites(Array.isArray(data.favorites) ? data.favorites : []);
        setState("ready");
      })
      .catch(() => setState("ready"));
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "var(--surface-page)" }}>
      <PageHeader
        title={language === "en" ? "Saved" : "Të preferuara"}
        description={
          language === "en"
            ? "Businesses you tapped the heart on."
            : "Bizneset që ke ruajtur me zemër."
        }
      />

      <div className="page-shell py-4 sm:py-6">
        {state === "loading" && (
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className="h-[190px] animate-pulse rounded-[14px]"
                style={{ background: "var(--surface-subtle)" }}
              />
            ))}
          </div>
        )}

        {state === "signed-out" && (
          <EmptyState
            icon={Heart}
            title={language === "en" ? "Sign in to see your saved list" : "Hyr për të parë listën tënde"}
            description={
              language === "en"
                ? "Your saved businesses follow your account, so they are there on every device."
                : "Bizneset e ruajtura lidhen me llogarinë tënde dhe i gjen në çdo pajisje."
            }
            action={
              <Link href="/login" className="btn-primary">
                {language === "en" ? "Sign in" : "Hyr"}
              </Link>
            }
          />
        )}

        {state === "ready" &&
          (favorites.length ? (
            <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {favorites.map((listing: any) => (
                <BusinessCard key={listing._id || listing.slug} listing={listing} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Heart}
              title={language === "en" ? "Nothing saved yet" : "Ende asgjë e ruajtur"}
              description={
                language === "en"
                  ? "Tap the heart on a business to keep it here."
                  : "Shtyp zemrën te një biznes për ta mbajtur këtu."
              }
              action={
                <Link href="/listings" className="btn-primary">
                  {language === "en" ? "Browse businesses" : "Shfleto bizneset"}
                </Link>
              }
            />
          ))}
      </div>
    </div>
  );
}
