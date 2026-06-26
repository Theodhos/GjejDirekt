"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import {
  CreditCard,
  ArrowRight,
  ShieldCheck,
  Lock,
  CheckCircle2
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// PayPal (handles both PayPal balance and card payments securely)
import { PayPalScriptProvider, PayPalButtons, FUNDING } from "@paypal/react-paypal-js";
import toast from "react-hot-toast";

const copy = {
  al: {
    eyebrow: "Pagesë e sigurt",
    title: "Pagesë e Sigurt",
    subtitle: "Ngrini prezencën tuaj në platformën tonë.",
    creditCard: "Kartë Krediti",
    paypal: "PayPal",
    cardTitle: "Paguaj me Kartë",
    cardDesc: "Vendosni të dhënat e kartës tuaj në mënyrë të sigurt. Të dhënat përpunohen të enkriptuara dhe nuk ruhen kurrë në serverët tanë.",
    pay: "Paguaj",
    paypalDesc: "Paguani në mënyrë të sigurt me llogarinë tuaj PayPal.",
    paypalError: "Verifikimi i PayPal dështoi",
    paymentFailed: "Pagesa dështoi",
    sslSecure: "256-bit SSL i Sigurt",
    pciCompliant: "Në Përputhje me PCI",
    orderSummary: "Përmbledhja e Porosisë",
    premiumActivation: "Aktivizim Premium",
    packetLabel: "Paketa",
    monthlySub: "Abonim Mujor",
    transactionFee: "Tarifa e Transaksionit",
    totalDue: "Totali për t'u Paguar",
    noHiddenFees: "Pa Tarifa të Fshehura",
    instantBenefit: "Përfitim i Menjëhershëm",
    instantBenefitDesc:
      "Listimi juaj do të marrë distinktivin premium dhe shikueshmëri të zgjeruar menjëherë pas pagesës.",
    successTitle: "Sukses!",
    successDescA: "Paketa juaj ",
    successDescB: " u aktivizua. Listimi juaj po përditësohet me veçori premium.",
    backToDashboard: "Kthehu te Paneli",
  },
  en: {
    eyebrow: "Secure payment",
    title: "Secure Checkout",
    subtitle: "Elevate your presence on our platform.",
    creditCard: "Credit Card",
    paypal: "PayPal",
    cardTitle: "Pay with Card",
    cardDesc: "Enter your card details securely. Your data is processed encrypted and is never stored on our servers.",
    pay: "Pay",
    paypalDesc: "Securely pay using your PayPal account.",
    paypalError: "PayPal verification failed",
    paymentFailed: "Payment failed",
    sslSecure: "256-bit SSL Secure",
    pciCompliant: "PCI Compliant",
    orderSummary: "Order Summary",
    premiumActivation: "Premium Activation",
    packetLabel: "Packet",
    monthlySub: "Monthly Subscription",
    transactionFee: "Transaction Fee",
    totalDue: "Total Due",
    noHiddenFees: "No Hidden Fees",
    instantBenefit: "Instant Benefit",
    instantBenefitDesc:
      "Your listing will receive its premium badge and enhanced visibility immediately after checkout.",
    successTitle: "Success!",
    successDescA: "Your ",
    successDescB: " packet has been activated. Your listing is now being updated with premium features.",
    backToDashboard: "Back to Dashboard",
  },
};

function CheckoutPageClient() {
  const { language } = useLanguage();
  const c = copy[language];
  const searchParams = useSearchParams();
  const packet = searchParams?.get("packet") || "verify";
  const price = searchParams?.get("price") || "5";
  const listingId = searchParams?.get("listingId") || "";

  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal">("card");
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePayPalSuccess = async (details: any) => {
    try {
      const res = await fetch("/api/checkout/paypal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderID: details.id,
          packet,
          listingId
        }),
      });
      if (res.ok) setIsSuccess(true);
    } catch (err) {
      toast.error(c.paypalError);
    }
  };

  if (isSuccess) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--surface-page)" }}>
        <div className="text-center max-w-md animate-in fade-in zoom-in duration-700">
          <div className="w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-10" style={{ background: "rgba(34,153,120,0.1)" }}>
            <CheckCircle2 className="w-14 h-14" style={{ color: "var(--brand-accent)" }} />
          </div>
          <h1
            className="font-bold tracking-tight mb-5"
            style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: "var(--text-primary)", lineHeight: 1.1 }}
          >
            {c.successTitle}
          </h1>
          <p className="text-base font-medium leading-relaxed mb-10" style={{ color: "var(--text-secondary)" }}>
            {c.successDescA}<span className="font-bold capitalize" style={{ color: "var(--text-primary)" }}>{packet}</span>{c.successDescB}
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-sm text-white transition-all hover:opacity-90 active:scale-95"
            style={{ background: "var(--text-primary)" }}
          >
            {c.backToDashboard}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-20" style={{ background: "var(--surface-page)" }}>
      <div className="page-shell">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-12 lg:grid-cols-[1fr_400px]">

            <div className="space-y-10">
              <div>
                <p className="eyebrow mb-3">{c.eyebrow}</p>
                <h1
                  className="font-bold tracking-tight mb-4"
                  style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: "var(--text-primary)", lineHeight: 1.1 }}
                >
                  {c.title}
                </h1>
                <p className="text-base font-medium leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {c.subtitle}
                </p>
              </div>

              {/* Toggle */}
              <div
                className="inline-flex p-1.5 rounded-full"
                style={{ background: "var(--surface-cream)", border: "1px solid var(--border-soft)" }}
              >
                <button
                  onClick={() => setPaymentMethod("card")}
                  className="px-7 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all text-white"
                  style={
                    paymentMethod === "card"
                      ? { background: "var(--text-primary)" }
                      : { background: "transparent", color: "var(--text-tertiary)" }
                  }
                >
                  {c.creditCard}
                </button>
                <button
                  onClick={() => setPaymentMethod("paypal")}
                  className="px-7 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all"
                  style={
                    paymentMethod === "paypal"
                      ? { background: "#0070ba", color: "#ffffff" }
                      : { background: "transparent", color: "var(--text-tertiary)" }
                  }
                >
                  {c.paypal}
                </button>
              </div>

              <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test", currency: "EUR", components: "buttons" }}>
                {paymentMethod === "card" ? (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div
                      className="p-10"
                      style={{ background: "var(--surface-white)", border: "1px solid var(--border-soft)", borderRadius: "16px", boxShadow: "var(--shadow-card)" }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <CreditCard className="w-6 h-6" style={{ color: "var(--text-primary)" }} />
                        <h3 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>{c.cardTitle}</h3>
                      </div>
                      <p className="font-medium mb-8" style={{ color: "var(--text-secondary)" }}>{c.cardDesc}</p>
                      <PayPalButtons
                        fundingSource={FUNDING.CARD}
                        style={{ layout: "vertical", shape: "pill", label: "pay", color: "black" }}
                        createOrder={(data, actions) => {
                          return actions.order.create({ intent: "CAPTURE", purchase_units: [{ amount: { value: price.toString(), currency_code: "EUR" } }] });
                        }}
                        onApprove={async (data, actions) => {
                          const details = await actions.order?.capture();
                          handlePayPalSuccess(details);
                        }}
                        onError={() => toast.error(c.paymentFailed)}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div
                      className="p-10 text-center"
                      style={{ background: "var(--surface-white)", border: "1px solid var(--border-soft)", borderRadius: "16px", boxShadow: "var(--shadow-card)" }}
                    >
                      <div className="relative w-40 h-12 mx-auto mb-8">
                        <Image src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg" alt="PayPal" fill className="object-contain" />
                      </div>
                      <p className="font-medium mb-8" style={{ color: "var(--text-secondary)" }}>{c.paypalDesc}</p>
                      <PayPalButtons
                        fundingSource={FUNDING.PAYPAL}
                        style={{ layout: "vertical", shape: "pill", label: "pay" }}
                        createOrder={(data, actions) => {
                          return actions.order.create({ intent: "CAPTURE", purchase_units: [{ amount: { value: price.toString(), currency_code: "EUR" } }] });
                        }}
                        onApprove={async (data, actions) => {
                          const details = await actions.order?.capture();
                          handlePayPalSuccess(details);
                        }}
                        onError={() => toast.error(c.paypalError)}
                      />
                    </div>
                  </div>
                )}
              </PayPalScriptProvider>

              <div className="flex items-center justify-center gap-10 py-8" style={{ borderTop: "1px solid var(--border-soft)" }}>
                <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-tertiary)" }}>
                  <ShieldCheck className="w-5 h-5" style={{ color: "var(--brand-accent)" }} /> {c.sslSecure}
                </div>
                <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-tertiary)" }}>
                  <Lock className="w-5 h-5" style={{ color: "var(--brand-accent)" }} /> {c.pciCompliant}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <aside>
              <div
                className="overflow-hidden sticky top-24"
                style={{ background: "var(--surface-white)", border: "1px solid var(--border-soft)", borderRadius: "18px", boxShadow: "var(--shadow-card)" }}
              >
                <div className="p-10" style={{ background: "var(--text-primary)" }}>
                  <h3 className="text-2xl font-bold mb-2 tracking-tight" style={{ color: "#ffffff" }}>{c.orderSummary}</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.65)" }}>{c.premiumActivation}</p>
                </div>
                <div className="p-10 space-y-7">
                  <div className="flex justify-between items-center pb-6" style={{ borderBottom: "1px solid var(--border-soft)" }}>
                    <div>
                      <p className="font-bold text-lg capitalize" style={{ color: "var(--text-primary)" }}>{packet} {c.packetLabel}</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-tertiary)" }}>{c.monthlySub}</p>
                    </div>
                    <span className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>€{price}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-tertiary)" }}>{c.transactionFee}</span>
                    <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-tertiary)" }}>€0.00</span>
                  </div>
                  <div className="pt-4 flex justify-between items-center">
                    <span className="font-bold text-xl" style={{ color: "var(--text-primary)" }}>{c.totalDue}</span>
                    <div className="text-right">
                      <span className="text-4xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>€{price}</span>
                      <p className="text-[10px] font-bold uppercase tracking-widest mt-2" style={{ color: "var(--brand-accent)" }}>{c.noHiddenFees}</p>
                    </div>
                  </div>

                  <div className="pt-6">
                    <div className="p-7 rounded-2xl" style={{ background: "var(--surface-cream)", border: "1px solid var(--border-soft)" }}>
                      <h4 className="text-sm font-bold mb-2" style={{ color: "var(--text-primary)" }}>{c.instantBenefit}</h4>
                      <p className="text-xs font-medium leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                        {c.instantBenefitDesc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

          </div>
        </div>
      </div>
    </main>
  );
}

export default CheckoutPageClient;
