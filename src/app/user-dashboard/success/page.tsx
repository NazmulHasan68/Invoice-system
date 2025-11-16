"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, CheckCircle2 } from "lucide-react";

interface CheckoutSession {
  id: string;
  payment_status: string;
  amount_total: number;
  currency: string;
  customer_email?: string;
}

export default function Success() {
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get("session_id");

  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<CheckoutSession | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError("No session ID provided.");
      setLoading(false);
      return;
    }

    const fetchSession = async () => {
      try {
        const res = await fetch(`/api/stripe-session?session_id=${sessionId}`);
        if (!res.ok) throw new Error("Failed to fetch session data.");
        const data: CheckoutSession = await res.json();
        setSession(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-black" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-red-600">
        <p className="text-lg font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen text-center px-4">
      <CheckCircle2 className="text-green-600 w-12 h-12 mb-4" />
      <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
      <p className="text-gray-700 mb-4">
        Thank you for your purchase. Here are your transaction details:
      </p>

      {session && (
        <div className="bg-gray-100 p-6 rounded-lg shadow-md w-full max-w-md text-left">
          <p>
            <strong>Session ID:</strong> {session.id}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            {session.payment_status === "paid" ? "Paid ✅" : session.payment_status}
          </p>
          <p>
            <strong>Amount:</strong> {(session.amount_total / 100).toFixed(2)}{" "}
            {session.currency.toUpperCase()}
          </p>
          {session.customer_email && (
            <p>
              <strong>Email:</strong> {session.customer_email}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
