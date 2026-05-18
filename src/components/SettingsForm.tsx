"use client";

import { useState } from "react";
import { UploadButton } from "@/utils/uploadthing";
import { createCheckoutSession } from "@/app/actions/stripe";

interface SettingsFormProps {
  initialBusinessName: string;
  initialLogoUrl: string;
  initialAvatarUrl: string;
  isPremium: boolean;
  updateSettingsAction: (formData: FormData) => Promise<void>;
}

export function SettingsForm({ initialBusinessName, initialLogoUrl, initialAvatarUrl, isPremium, updateSettingsAction }: SettingsFormProps) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Only block interaction for the Premium Branding fields
  const handlePremiumInteraction = (e: React.MouseEvent | React.FocusEvent) => {
    if (!isPremium) {
      e.preventDefault();
      e.stopPropagation();
      setShowUpgradeModal(true);
    }
  };

  return (
    <>
      <form action={updateSettingsAction} className="space-y-10 relative">
        
        {/* SECTION: Personal Profile (Free) */}
        <div>
          <div className="mb-6 pb-2 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-xl">👤</span> Personal Profile
            </h3>
            <p className="text-xs text-slate-400 mt-1">Update your personal dashboard avatar.</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Profile Avatar URL
            </label>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                id="avatarUrlInput"
                name="avatarUrl"
                defaultValue={initialAvatarUrl}
                placeholder="Will be auto-filled upon upload"
                className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
              
              <div className="rounded-xl border border-dashed border-slate-700 bg-slate-800/20 p-6 flex flex-col items-center justify-center">
                <p className="text-xs text-slate-400 mb-4 text-center">Upload a personal avatar (Available on Free Tier)</p>
                <UploadButton
                  endpoint="personalAvatar"
                  onClientUploadComplete={(res) => {
                    if (res && res[0]) {
                      const input = document.getElementById("avatarUrlInput") as HTMLInputElement;
                      if (input) input.value = res[0].ufsUrl;
                      alert("Avatar uploaded! Click Save Settings at the bottom.");
                    }
                  }}
                  onUploadError={(error: Error) => {
                    alert(`Upload failed: ${error.message}`);
                  }}
                  appearance={{
                    button: "bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg px-4 py-2 text-sm transition-colors",
                    allowedContent: "text-slate-500 text-xs mt-2"
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION: Custom Branding (Premium) */}
        <div className="relative">
          {/* Invisible overlay to block clicks on free tier for this section only */}
          {!isPremium && (
            <div 
              className="absolute inset-0 z-10 cursor-pointer bg-slate-950/40 rounded-xl" 
              onClick={handlePremiumInteraction}
            />
          )}

          <div className="mb-6 pb-2 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-xl">🎨</span> Client-Facing Branding
              {!isPremium && <span className="ml-2 rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-indigo-300 border border-indigo-500/30">PREMIUM</span>}
            </h3>
            <p className="text-xs text-slate-400 mt-1">Customize the public delivery page that your clients see.</p>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-slate-300 mb-2">
                Business Name
              </label>
              <input
                type="text"
                id="businessName"
                name="businessName"
                defaultValue={initialBusinessName}
                placeholder="e.g. Acme Logistics"
                onFocus={handlePremiumInteraction}
                className={`w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-white placeholder-slate-500 focus:outline-none transition-colors ${isPremium ? "focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" : "opacity-50"}`}
                readOnly={!isPremium}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Company Logo URL
              </label>
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  id="logoUrlInput"
                  name="logoUrl"
                  defaultValue={initialLogoUrl}
                  placeholder="Will be auto-filled upon upload"
                  onFocus={handlePremiumInteraction}
                  className={`w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-white placeholder-slate-500 focus:outline-none transition-colors ${isPremium ? "focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" : "opacity-50"}`}
                  readOnly={!isPremium}
                />
                
                <div className={`rounded-xl border border-dashed border-slate-700 bg-slate-800/20 p-6 flex flex-col items-center justify-center ${!isPremium ? "opacity-50 pointer-events-none" : ""}`}>
                  <p className="text-xs text-slate-400 mb-4 text-center">Upload a new company logo for your public pages.</p>
                  <UploadButton
                    endpoint="companyLogo"
                    onClientUploadComplete={(res) => {
                      if (res && res[0]) {
                        const input = document.getElementById("logoUrlInput") as HTMLInputElement;
                        if (input) input.value = res[0].ufsUrl;
                        alert("Company logo uploaded! Click Save Settings.");
                      }
                    }}
                    onUploadError={(error: Error) => {
                      alert(`Upload failed: ${error.message}`);
                    }}
                    appearance={{
                      button: "bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg px-4 py-2 text-sm transition-colors",
                      allowedContent: "text-slate-500 text-xs mt-2"
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 relative z-20">
          <button
            type="submit"
            className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-xl bg-emerald-600 px-8 text-sm font-bold text-white shadow-lg transition-all hover:bg-emerald-500 hover:scale-[1.02] active:scale-[0.98]"
          >
            Save Settings
          </button>
        </div>
      </form>

      {/* Premium Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-indigo-900/30 bg-slate-950 p-6 sm:p-8 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl" />
            
            <div className="relative">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/10 mb-6 text-3xl ring-4 ring-indigo-500/20">
                🎨
              </div>
              <h2 className="text-2xl font-black text-white mb-2 text-center">Unlock Custom Branding</h2>
              <p className="text-slate-400 mb-8 text-center text-sm leading-relaxed">
                White-label your delivery pages! Upgrade to the Premium tier to instantly unlock custom company logos and branding, plus unlimited delivery jobs.
              </p>
              
              <div className="flex flex-col gap-3">
                <form action={createCheckoutSession} className="w-full">
                  <button type="submit" className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 font-bold text-white shadow-lg hover:from-indigo-400 hover:to-purple-500 transition-all">
                    Upgrade to Premium — $15/mo
                  </button>
                </form>
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="w-full h-12 rounded-xl border border-slate-700 bg-transparent font-semibold text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
