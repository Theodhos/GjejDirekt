"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { 
  CreditCard, 
  ArrowRight, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Loader2 
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Stripe & PayPal
import { loadStripe } from "@stripe/stripe-js";
import { 
  Elements, 
  CardElement, 
  useStripe, 
  useElements 
} from "@stripe/react-stripe-js";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import toast from "react-hot-toast";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder");

function StripeForm({ clientSecret, price, onBlur, onSuccess }: any) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)!,
      },
    });

    if (error) {
      toast.error(error.message || "Payment failed");
      setLoading(false);
    } else if (paymentIntent.status === "succeeded") {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-8 rounded-[2rem] bg-white border border-slate-200 shadow-xl">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 block">Card Details</label>
        <div className="py-4">
          <CardElement 
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#0f172a',
                  '::placeholder': { color: '#94a3b8' },
                },
              },
            }}
          />
        </div>
      </div>

      <button 
        disabled={!stripe || loading}
        className="w-full h-20 bg-slate-950 text-white rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 hover:bg-brand-600 transition-all shadow-2xl disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : `Pay €${price}`}
        {!loading && <ArrowRight className="w-6 h-6" />}
      </button>
    </form>
  );
}

function CheckoutPageClient() {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const packet = searchParams?.get("packet") || "verify";
  const price = searchParams?.get("price") || "5";
  const listingId = searchParams?.get("listingId") || "";
  
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal">("card");
  const [clientSecret, setClientSecret] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loadingSecret, setLoadingSecret] = useState(false);

  useEffect(() => {
    if (paymentMethod === "card" && price && !clientSecret) {
      setLoadingSecret(true);
      fetch("/api/checkout/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packet, price, listingId }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.clientSecret) setClientSecret(data.clientSecret);
        })
        .finally(() => setLoadingSecret(false));
    }
  }, [paymentMethod, price, packet, listingId, clientSecret]);

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
      toast.error("PayPal verification failed");
    }
  };

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center max-w-md animate-in fade-in zoom-in duration-700">
          <div className="w-32 h-32 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-10">
            <CheckCircle2 className="w-16 h-16 text-emerald-500" />
          </div>
          <h1 className="text-5xl font-black text-slate-950 mb-6 tracking-tight">Success!</h1>
          <p className="text-lg text-slate-500 font-medium mb-12 leading-relaxed">
            Your {packet} packet has been activated. Your listing is now being updated with premium features.
          </p>
          <Link 
            href="/dashboard"
            className="inline-flex items-center gap-3 px-12 py-5 bg-slate-950 text-white rounded-[2rem] font-black text-sm hover:bg-brand-600 transition-all shadow-2xl"
          >
            Back to Dashboard
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-24">
      <div className="page-shell">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-16 lg:grid-cols-[1fr_400px]">
            
            <div className="space-y-12">
              <div>
                <h1 className="text-6xl font-black text-slate-950 mb-4 tracking-tighter">Secure Checkout</h1>
                <p className="text-xl text-slate-500 font-medium">Elevate your presence on our platform.</p>
              </div>

              {/* Toggle */}
              <div className="inline-flex p-2 bg-white rounded-full border border-slate-200 shadow-sm">
                <button 
                  onClick={() => setPaymentMethod("card")}
                  className={`px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest transition-all ${paymentMethod === "card" ? "bg-slate-950 text-white shadow-xl" : "text-slate-400 hover:text-slate-600"}`}
                >
                  Credit Card
                </button>
                <button 
                  onClick={() => setPaymentMethod("paypal")}
                  className={`px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest transition-all ${paymentMethod === "paypal" ? "bg-[#0070ba] text-white shadow-xl" : "text-slate-400 hover:text-slate-600"}`}
                >
                  PayPal
                </button>
              </div>

              {paymentMethod === "card" ? (
                loadingSecret ? (
                  <div className="h-64 flex flex-col items-center justify-center gap-4 bg-white rounded-[3rem] border border-slate-100 shadow-sm animate-pulse">
                    <Loader2 className="w-10 h-10 animate-spin text-brand-500" />
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400">Initializing Secure Session...</p>
                  </div>
                ) : (
                  <div className="p-16 bg-white border border-slate-100 rounded-[3rem] shadow-xl text-center space-y-6">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-400">
                      <CreditCard className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-950">Card Payments Maintenance</h3>
                    <p className="text-slate-500 font-medium max-w-sm mx-auto">
                      Direct card payments are temporarily unavailable while we update our payment gateway. Please use PayPal or contact support for assistance.
                    </p>
                  </div>
                )
              ) : (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                   <div className="p-12 bg-white rounded-[3rem] border border-slate-100 shadow-xl text-center">
                      <div className="relative w-40 h-12 mx-auto mb-8">
                        <Image src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg" alt="PayPal" fill className="object-contain" />
                      </div>
                      <p className="text-slate-500 font-medium mb-10">Securely pay using your PayPal account or saved cards.</p>
                      <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test" , currency: "EUR" }}>
                        <PayPalButtons 
                          style={{ layout: "vertical", shape: "pill", label: "pay" }}
                          createOrder={(data, actions) => {
                            return actions.order.create({                              intent: "CAPTURE",                              purchase_units: [{ amount: { value: price.toString(), currency_code: "EUR" } }],
                            });
                          }}
                          onApprove={async (data, actions) => {
                            const details = await actions.order?.capture();
                            handlePayPalSuccess(details);
                          }}
                        />
                      </PayPalScriptProvider>
                   </div>
                </div>
              )}

              <div className="flex items-center justify-center gap-10 py-10 border-t border-slate-200">
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" /> 256-bit SSL Secure
                </div>
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <Lock className="w-5 h-5 text-emerald-500" /> PCI Compliant
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <aside>
              <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl overflow-hidden sticky top-24">
                <div className="bg-slate-950 p-12 text-white">
                  <h3 className="text-2xl font-black mb-2 tracking-tight">Order Summary</h3>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Premium Activation</p>
                </div>
                <div className="p-12 space-y-8">
                  <div className="flex justify-between items-center pb-6 border-b border-slate-50">
                    <div>
                      <p className="text-slate-950 font-black text-lg capitalize">{packet} Packet</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Monthly Subscription</p>
                    </div>
                    <span className="text-2xl font-black text-slate-950">€{price}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400">
                    <span className="text-xs font-black uppercase tracking-widest">Transaction Fee</span>
                    <span className="text-xs font-black uppercase tracking-widest">€0.00</span>
                  </div>
                  <div className="pt-4 flex justify-between items-center">
                    <span className="text-slate-950 font-black text-xl">Total Due</span>
                    <div className="text-right">
                      <span className="text-5xl font-black text-slate-950 tracking-tighter">€{price}</span>
                      <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mt-2">No Hidden Fees</p>
                    </div>
                  </div>
                  
                  <div className="pt-8">
                    <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                      <h4 className="text-sm font-black text-slate-900 mb-2">Instant Benefit</h4>
                      <p className="text-xs font-medium text-slate-500 leading-relaxed">
                        Your listing will receive its premium badge and enhanced visibility immediately after checkout.
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

