import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/db";
import { redirect } from "next/navigation";
import { approveGCashPayment, rejectGCashPayment } from "@/app/actions/gcash";
import { isAdminEmail } from "@/lib/admin";

export const metadata = {
  title: "Admin | GCash Requests | SignOff",
};

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en-PH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

export default async function GCashRequestsAdminPage({
  searchParams,
}: {
  searchParams?: { status?: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  if (!isAdminEmail(session.user.email)) {
    redirect("/dashboard");
  }

  const status = searchParams?.status;
  const result = await db.query(
    `SELECT r.id, r.amount_cents, r.status, r.requested_at, r.confirmed_at, u.email, u.name
     FROM gcash_payment_requests r
     JOIN users u ON u.id = r.user_id
     ORDER BY r.requested_at DESC`,
    []
  );

  const requests = result.rows;

  const statusMessage =
    status === "approved"
      ? "The payment request was approved and the account was upgraded."
      : status === "rejected"
      ? "The payment request was rejected. You may follow up with the customer."
      : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400/80">Admin Panel</p>
            <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">GCash Payment Verification</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-400 sm:text-base">
              Review incoming GCash payment requests and mark them approved or rejected once you have verified payment receipts.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-6 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>

        {statusMessage ? (
          <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-5 text-sm text-emerald-100">
            {statusMessage}
          </div>
        ) : null}

        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 shadow-xl">
          <div className="border-b border-slate-800 bg-slate-950/80 px-6 py-5 sm:px-8">
            <h2 className="text-lg font-semibold text-white">Pending GCash Payment Requests</h2>
          </div>
          <div className="p-6 sm:p-8">
            {requests.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-950/50 p-12 text-center text-slate-400">
                No GCash payment requests have been submitted yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-800 text-left text-sm">
                  <thead>
                    <tr className="text-slate-400">
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Requested</th>
                      <th className="px-4 py-3">Confirmed</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {requests.map((request) => (
                      <tr key={request.id} className="odd:bg-slate-950 even:bg-slate-900">
                        <td className="whitespace-nowrap px-4 py-4">
                          <p className="font-semibold text-white">{request.name || request.email || "Unknown"}</p>
                          <p className="text-xs text-slate-500">{request.email}</p>
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-slate-100">₱{(request.amount_cents / 100).toFixed(2)}</td>
                        <td className="whitespace-nowrap px-4 py-4">
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            request.status === "pending"
                              ? "bg-yellow-500/10 text-yellow-300"
                              : request.status === "awaiting_verification"
                              ? "bg-sky-500/10 text-sky-300"
                              : request.status === "confirmed"
                              ? "bg-emerald-500/10 text-emerald-300"
                              : "bg-rose-500/10 text-rose-300"
                          }`}>
                            {request.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-slate-400">{formatDate(request.requested_at)}</td>
                        <td className="whitespace-nowrap px-4 py-4 text-slate-400">{formatDate(request.confirmed_at)}</td>
                        <td className="px-4 py-4">
                          {request.status === "pending" || request.status === "awaiting_verification" ? (
                            <div className="flex flex-col gap-2 sm:flex-row">
                              <form action={approveGCashPayment} className="sm:w-auto">
                                <input type="hidden" name="requestId" value={request.id} />
                                <button
                                  type="submit"
                                  className="inline-flex h-11 items-center justify-center rounded-xl bg-emerald-500 px-4 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                                >
                                  Approve
                                </button>
                              </form>
                              <form action={rejectGCashPayment} className="sm:w-auto">
                                <input type="hidden" name="requestId" value={request.id} />
                                <button
                                  type="submit"
                                  className="inline-flex h-11 items-center justify-center rounded-xl bg-rose-500 px-4 text-sm font-semibold text-white transition hover:bg-rose-400"
                                >
                                  Reject
                                </button>
                              </form>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-500">No actions available</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
