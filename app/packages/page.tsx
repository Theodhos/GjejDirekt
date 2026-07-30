"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle, ArrowRight, Zap, Crown, Rocket } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import Button from "@/components/ui/Button";

const PACKAGES = [
  {
    id: "verify",
    name: "Verify",
    price: 9.99,
    description: "Basic verification for your listing",
    icon: CheckCircle,
    color: "brand",
    features: [
      "Listing verification badge",
      "Priority support",
      "Basic analytics",
      "Standard placement"
    ]
  },
  {
    id: "trading",
    name: "Trading",
    price: 29.99,
    description: "Increased visibility and reach",
    icon: Zap,
    color: "orange",
    features: [
      "All Verify features",
      "Featured placement",
      "First ranking in category",
      "Advanced analytics",
      "30-day duration"
    ],
    popular: true
  },
  {
    id: "features",
    name: "Features",
    price: 99.99,
    description: "Maximum visibility and premium placement",
    icon: Crown,
    color: "yellow",
    features: [
      "All Trading features",
      "Top placement guarantee",
      "Promoted across platform",
      "Premium badge",
      "90-day duration",
      "Custom listing design"
    ]
  }
];

export default function PackagesPage() {
  const { language } = useLanguage();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [step, setStep] = useState<"select" | "payment">("select");
  const [paymentMethod, setPaymentMethod] = useState<"paypal" | "card" | null>(null);

  const t = {
    en: {
      title: "Choose Your Listing Plan",
      subtitle: "Boost your visibility and reach more customers",
      select: "Select Plan",
      payNow: "Pay Now",
      or: "or",
      back: "Back",
      checkout: "Proceed to Checkout",
      paymentMethod: "Payment Method",
      paypal: "Pay with PayPal",
      card: "Pay with Card",
      cardDetails: "Card Details",
      processing: "Processing payment...",
      success: "Payment successful!"
    },
    sq: {
      title: "Zgjidhni Planin Tuaj",
      subtitle: "Rritni dukshmërinë tuaj dhe arritni më shumë klientë",
      select: "Zgjidh Planin",
      payNow: "Paguaj Tani",
      or: "ose",
      back: "Mbrapsht",
      checkout: "Vazhdo në Pagesë",
      paymentMethod: "Metoda e Pagesës",
      paypal: "Paguaj me PayPal",
      card: "Paguaj me Kartë",
      cardDetails: "Detajet e Kartës",
      processing: "Duke procesuar pagesën...",
      success: "Pagesa u krye me sukses!"
    }
  };

  const labels = language === "en" ? t.en : t.sq;
  const pkg = PACKAGES.find(p => p.id === selectedPackage);
  const PackageIcon = pkg?.icon;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="mb-4 text-3xl font-black text-slate-950 sm:text-5xl lg:text-6xl">{labels.title}</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">{labels.subtitle}</p>
        </div>

        {step === "select" ? (
          <>
            {/* Packages Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {PACKAGES.map((plan) => {
                const Icon = plan.icon;
                const isSelected = selectedPackage === plan.id;
                const bgColor = {
                  brand: "bg-blue-50 border-blue-200",
                  orange: "bg-orange-50 border-orange-200",
                  yellow: "bg-yellow-50 border-yellow-200"
                };
                const accentColor = {
                  brand: "text-blue-700 bg-blue-100",
                  orange: "text-orange-700 bg-orange-100",
                  yellow: "text-yellow-700 bg-yellow-100"
                };

                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPackage(plan.id)}
                    className={`relative rounded-[2.5rem] border-2 p-8 transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? `border-brand-500 ${bgColor[plan.color as keyof typeof bgColor]} shadow-2xl transform scale-105`
                        : `border-slate-200 bg-white hover:border-slate-300 shadow-sm hover:shadow-xl`
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-brand-500 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                          {language === "en" ? "Most Popular" : "Më i Popullaruar"}
                        </span>
                      </div>
                    )}

                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                      isSelected ? `${accentColor[plan.color as keyof typeof accentColor]}` : "bg-slate-100 text-slate-700"
                    }`}>
                      <Icon className="w-8 h-8" />
                    </div>

                    <h3 className="mb-2 text-2xl font-black text-slate-950 sm:text-3xl">{plan.name}</h3>
                    <p className="text-slate-600 text-sm mb-6">{plan.description}</p>

                    <div className="mb-8">
                      <span className="text-4xl font-black text-slate-950 sm:text-5xl">${plan.price}</span>
                      <span className="text-slate-600 ml-2">{language === "en" ? "one-time" : "njëherë"}</span>
                    </div>

                    <div className="space-y-3 mb-8">
                      {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-slate-700">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={() => {
                        setSelectedPackage(plan.id);
                        setStep("payment");
                      }}
                      className="w-full"
                    >
                      {labels.select} <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <>
            {/* Payment Step */}
            <div className="max-w-2xl mx-auto bg-white rounded-[3rem] border border-slate-200 p-8 sm:p-12 shadow-2xl">
              <div className="mb-8">
                <button
                  onClick={() => setStep("select")}
                  className="text-brand-600 hover:text-brand-700 text-sm font-semibold mb-6"
                >
                  ← {labels.back}
                </button>
                
                {pkg && (
                  <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-200">
                    {PackageIcon && (
                      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
                        <PackageIcon className="w-8 h-8 text-slate-700" />
                      </div>
                    )}
                    <div>
                      <h2 className="text-2xl font-black text-slate-950">{pkg.name}</h2>
                      <p className="text-slate-600">${pkg.price}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-black text-slate-950 mb-4">{labels.paymentMethod}</h3>
                
                <div className="space-y-3">
                  <button
                    onClick={() => setPaymentMethod("paypal")}
                    className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                      paymentMethod === "paypal"
                        ? "border-brand-500 bg-brand-50"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === "paypal"
                          ? "border-brand-500"
                          : "border-slate-300"
                      }`}>
                        {paymentMethod === "paypal" && (
                          <div className="w-3 h-3 rounded-full bg-brand-500" />
                        )}
                      </div>
                      <span className="font-semibold text-slate-950">{labels.paypal}</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setPaymentMethod("card")}
                    className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                      paymentMethod === "card"
                        ? "border-brand-500 bg-brand-50"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === "card"
                          ? "border-brand-500"
                          : "border-slate-300"
                      }`}>
                        {paymentMethod === "card" && (
                          <div className="w-3 h-3 rounded-full bg-brand-500" />
                        )}
                      </div>
                      <span className="font-semibold text-slate-950">{labels.card}</span>
                    </div>
                  </button>
                </div>
              </div>

              {paymentMethod === "card" && (
                <div className="mb-8 p-6 bg-slate-50 rounded-2xl">
                  <h4 className="font-semibold text-slate-950 mb-4">{labels.cardDetails}</h4>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder={language === "en" ? "Card Number" : "Numri i Kartës"}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none"
                      maxLength={19}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder={language === "en" ? "MM/YY" : "MM/YY"}
                        className="px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none"
                        maxLength={5}
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        className="px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none"
                        maxLength={3}
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "paypal" && (
                <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-2xl">
                  <p className="text-sm text-blue-800">
                    {language === "en"
                      ? "You will be redirected to PayPal to complete your payment securely."
                      : "Do të ridrejtoheni në PayPal për të përfunduar pagesën tuaj me siguri."}
                  </p>
                </div>
              )}

              <Button
                onClick={() => alert(labels.success)}
                disabled={!paymentMethod}
                className="w-full"
              >
                {labels.checkout}
              </Button>

              <p className="text-center text-xs text-slate-600 mt-4">
                {language === "en"
                  ? "Your payment is secure and encrypted"
                  : "Pagesa juaj është e sigurt dhe e enkriptuar"}
              </p>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
