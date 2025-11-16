import { createStripeCheckout } from "@/actions/payment-action";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { assetId } = await req.json();
    const data = await createStripeCheckout(assetId); // server action
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
