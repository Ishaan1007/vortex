"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./checkout.module.css";
import type { GeneratedTicket } from "@/lib/ticketing";

type RazorpaySuccessResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayFailureResponse = {
  error?: {
    code?: string;
    description?: string;
    source?: string;
    step?: string;
    reason?: string;
    metadata?: Record<string, string>;
  };
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpaySuccessResponse) => Promise<void>;
  prefill: {
    name: string;
  };
};

type CreateOrderResponse = {
  razorpayKey: string;
  orderRecordId: string;
  order: {
    razorpayOrderId: string;
    amount: number;
    currency: string;
    receipt: string;
  };
};

type VerifyPaymentResponse = {
  ticketUrl: string;
  ticketRecordId: string;
  generatedTickets?: GeneratedTicket[];
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => {
      on: (event: "payment.failed", callback: (response: RazorpayFailureResponse) => void) => void;
      open: () => void;
    };
  }
}

const loadRazorpayScript = () =>
  new Promise<void>((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Client side only"));
      return;
    }

    if (window.Razorpay) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Razorpay load failed"));
    document.body.appendChild(script);
  });

const readErrorMessage = async (response: Response, fallback: string) => {
  const contentType = response.headers.get("content-type") ?? "";
  const bodyText = await response.text();

  if (contentType.includes("application/json")) {
    try {
      const data = JSON.parse(bodyText) as { error?: string };
      return data.error || fallback;
    } catch {
      return fallback;
    }
  }

  if (response.status === 404) {
    return "API route not found. Restart the Next dev server and try again.";
  }

  if (bodyText.trim().startsWith("<!DOCTYPE") || bodyText.trim().startsWith("<html")) {
    return fallback;
  }

  return bodyText || fallback;
};

const readJson = async <T,>(response: Response) => {
  return (await response.json()) as T;
};

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checkoutData, setCheckoutData] = useState<{
    selectedGames: { name: string; quantity: number }[];
    totalTickets: number;
    totalPrice: number;
  } | null>(null);
  const [userName, setUserName] = useState("");
  const [savedName, setSavedName] = useState("");
  const [error, setError] = useState("");
  const [ticketUrl, setTicketUrl] = useState("");
  const [ticketRecordId, setTicketRecordId] = useState("");
  const [generatedTickets, setGeneratedTickets] = useState<GeneratedTicket[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
    const item = localStorage.getItem("vortex_booking");
    if (!item) {
      router.push("/game-selection");
      return;
    }

    const parsed = JSON.parse(item);
    if (!parsed.selectedGames || parsed.selectedGames.length === 0) {
      router.push("/game-selection");
      return;
    }

    setCheckoutData(parsed);
  }, [router]);

  if (!isReady || !checkoutData) {
    return <p className="p-8">Loading...</p>;
  }

  const totalTickets = checkoutData.totalTickets || 0;
  const totalPrice = checkoutData.totalPrice || 0;
  const previewPrice = totalTickets > 0 ? Math.round((totalPrice / totalTickets) * 100) / 100 : totalPrice;
  const displayName = savedName || "Your_Name";

  const onSaveName = () => {
    const trimmedName = userName.trim();
    if (!trimmedName) {
      setError("Enter your name before saving");
      return;
    }

    setSavedName(trimmedName);
    setUserName(trimmedName);
    setError("");
  };

  const onEditName = () => {
    setSavedName("");
    setError("");
  };

  const onPayNow = async () => {
    setError("");
    if (!savedName.trim()) {
      setError("Save your name before payment");
      return;
    }

    if (!checkoutData || totalTickets === 0) {
      setError("No tickets selected");
      return;
    }

    setLoading(true);
    try {
      await loadRazorpayScript();

      const createRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalPrice,
          userName: savedName,
          gamesSelected: checkoutData.selectedGames.map((g) => g.name),
          quantity: totalTickets,
        }),
      });

      if (!createRes.ok) {
        throw new Error(await readErrorMessage(createRes, "Could not create payment order"));
      }

      const data = await readJson<CreateOrderResponse>(createRes);
      const options = {
        key: data.razorpayKey,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "VORTEX '26",
        description: `Ticket purchase for ${savedName}`,
        order_id: data.order.razorpayOrderId,
        handler: async (response: RazorpaySuccessResponse) => {
          try {
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderRecordId: data.orderRecordId,
                userName: savedName,
                gamesSelected: checkoutData.selectedGames.map((g) => g.name),
                quantity: totalTickets,
                amount: totalPrice,
              }),
            });

            if (!verifyRes.ok) {
              throw new Error(await readErrorMessage(verifyRes, "Payment verification failed"));
            }

            const verifyData = await readJson<VerifyPaymentResponse>(verifyRes);
            setTicketUrl(verifyData.ticketUrl);
            setTicketRecordId(verifyData.ticketRecordId);
            setGeneratedTickets(verifyData.generatedTickets ?? []);
            localStorage.removeItem("vortex_booking");
          } catch (verifyError) {
            console.error("verify error", verifyError);
            setError("Payment completed but verification failed. Contact support.");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: savedName,
        },
      };

      if (!window.Razorpay) {
        throw new Error("Razorpay SDK unavailable");
      }

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response: RazorpayFailureResponse) => {
        setError("Payment failed. Please try again.");
        setLoading(false);
        console.error("Razorpay payment failed", response);
      });

      rzp.open();
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Unable to start payment process");
      setLoading(false);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.panel}>
        <header className={styles.header}>
          <h1 className={styles.brand}>VORTEX&apos;26</h1>
          <p className={styles.tagline}>Get pulled into the game</p>
        </header>

        <div className={styles.divider} />

        <section className={styles.section}>
          <label className={styles.fieldLabel} htmlFor="user-name">
            Your Name
          </label>
          <div className={styles.inputWrap}>
            <input
              id="user-name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className={styles.nameInput}
              placeholder="Enter your name"
              disabled={Boolean(savedName)}
            />
          </div>
          <div className={styles.nameActions}>
            {savedName ? (
              <>
                <span className={styles.nameSaved}>Saved as {savedName}</span>
                <button type="button" onClick={onEditName} className={styles.nameActionButton}>
                  Edit
                </button>
              </>
            ) : (
              <button type="button" onClick={onSaveName} className={styles.nameActionButton}>
                Save Name
              </button>
            )}
          </div>
        </section>

        <section className={styles.section}>
          <p className={styles.infoText}>Your ticket will be generated instantly after payment</p>
          <div className={styles.ticketCard}>
            <h2 className={styles.ticketTitle}>VORTEX&apos;26</h2>
            <div className={styles.ticketMeta}>
              <div className={styles.ticketMetaRow}>
                <span className={styles.ticketMetaLabel}>Event Participated:</span>
                <span className={`${styles.ticketMetaSkeleton} ${styles.ticketMetaSkeletonWide}`} aria-hidden="true" />
              </div>
              <div className={styles.ticketMetaRow}>
                <span className={styles.ticketMetaLabel}>Ticket ID:</span>
                <span className={`${styles.ticketMetaSkeleton} ${styles.ticketMetaSkeletonMedium}`} aria-hidden="true" />
              </div>
              <div className={styles.ticketMetaRow}>
                <span className={styles.ticketMetaLabel}>Ticket Price:</span>
                <span className={styles.ticketMetaValue}>₹{previewPrice}</span>
              </div>
            </div>
            <div className={styles.ticketName}>{displayName}</div>
          </div>
        </section>

        <div className={styles.divider} />

        <section className={styles.paymentSection}>
          <h2 className={styles.paymentTitle}>COMPLETE YOUR PAYMENT</h2>
          <p className={styles.paymentSubtitle}>Secure UPI Payment</p>

          {error ? <p className={styles.error}>{error}</p> : null}

          {ticketUrl ? (
            <div className={styles.successBox}>
              <h3 className={styles.successTitle}>Payment Completed!</h3>
              <p className={styles.successText}>Your tickets are ready below.</p>
              <div className={styles.ticketList}>
                {generatedTickets.map((generatedTicket) => (
                  <a
                    key={generatedTicket.ticketId}
                    href={generatedTicket.ticketUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.ticketLink}
                  >
                    <span>{generatedTicket.ticketId}</span>
                    <span>₹{generatedTicket.amount}</span>
                  </a>
                ))}
              </div>
              <div className={styles.successActions}>
                <a
                  href={ticketUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`${styles.successButton} ${styles.successButtonGreen}`}
                >
                  Download Ticket
                </a>
                <button
                  onClick={() => router.push(`/ticket/${ticketRecordId}`)}
                  className={`${styles.successButton} ${styles.successButtonDark}`}
                >
                  View Details
                </button>
              </div>
            </div>
          ) : null}

          <div className={styles.payRow}>
            <button onClick={onPayNow} disabled={loading || !!ticketUrl} className={styles.payButton}>
              {loading ? "Processing..." : ticketUrl ? "Payment Done" : `PAY \u20B9${totalPrice}`}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
