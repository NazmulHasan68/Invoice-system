'use client'

import { useState } from "react";
import { Button } from "../ui/button";
import { ShoppingCart } from "lucide-react";

interface BuyAssetsProps {
  assetId: string;
}

export default function BuyAssets({ assetId }: BuyAssetsProps) {
  const [loading, setLoading] = useState(false);

  const handleBuy = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assetId }),
      });
      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Something went wrong!");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleBuy}>
      <Button
        type="submit"
        className="w-full bg-black text-white h-12 flex items-center justify-center gap-2"
        disabled={loading}
      >
        <ShoppingCart className="w-6 h-6" />
        {loading ? "Processing..." : "Purchase Now"}
      </Button>
    </form>
  );
}
