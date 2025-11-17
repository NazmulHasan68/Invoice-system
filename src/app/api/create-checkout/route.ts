import { NextRequest, NextResponse } from "next/server";
import { createStripeCheckout } from "@/actions/payment-action";

export async function POST(req: NextRequest) {
  try {
    const { assetId } = await req.json();

    if (!assetId) {
      return NextResponse.json({ error: "Asset ID is required" }, { status: 400 });
    }

    const data = await createStripeCheckout(assetId);
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Create Checkout Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
