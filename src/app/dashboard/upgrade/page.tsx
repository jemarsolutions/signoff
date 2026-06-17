import Image from "next/image";
import { GCashUpgradeCard } from "@/components/GCashUpgradeCard";

export const metadata = {
  title: "Upgrade to Premium | SignOff",
};

export default function UpgradePage({ searchParams }: { searchParams?: { status?: string } }) {
  const status = searchParams?.status;
  const title = status === "awaiting_verification"
    ? "Payment Confirmation Sent"
    : status === "submitted"
    ? "GCash Payment Instructions"
    : "Upgrade to Premium";

  const message = status === "awaiting_verification"
    ? "Thanks! We recorded your payment confirmation. We will verify the payment and upgrade your account as soon as we confirm it."
    : status === "submitted"
    ? "Scan the QR code below with your GCash app and send ₱850. After payment, click 'I have paid' so we can verify your request."
    : "Scan the QR code below with your GCash app and send ₱850. After payment, click 'I have paid' so we can verify your request.";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-800 bg-slate-900/80 p-10 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black text-white sm:text-4xl">GCash Payment Instructions</h1>
          <p className="mt-3 text-sm text-slate-400 sm:text-base">
            {message}
          </p>
        </div>

        <GCashUpgradeCard />
      </div>
    </div>
  );
}
