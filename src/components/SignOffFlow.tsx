"use client";

import { useState } from "react";
import { UploadButton } from "@/utils/uploadthing";
import { SignaturePad } from "@/components/SignaturePad";

interface SignOffFlowProps {
  jobId: string;
  onComplete: (photoUrl: string | null, signatureUrl: string) => Promise<void>;
}

export function SignOffFlow({ jobId, onComplete }: SignOffFlowProps) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const handleSignatureSave = async (signatureUrl: string) => {
    await onComplete(photoUrl, signatureUrl);
  };

  return (
    <div className="space-y-6 w-full">
      {/* Photo Upload Section */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md shadow-xl flex flex-col items-center w-full">
        <h2 className="text-lg font-bold text-white mb-1 w-full text-left">Delivery Photo (Optional)</h2>
        <p className="text-xs text-slate-400 mb-4 w-full text-left">Snap a photo of the delivered goods.</p>
        
        {photoUrl ? (
          <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-700">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img src={photoUrl} alt="Delivery" className="object-cover w-full h-full" />
             <button 
               onClick={() => setPhotoUrl(null)} 
               className="absolute top-2 right-2 bg-slate-900/80 text-white rounded-full p-1.5 hover:bg-red-500 transition"
               aria-label="Remove photo"
             >
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
               </svg>
             </button>
          </div>
        ) : (
          <div className="w-full flex justify-center py-4 bg-slate-950/50 rounded-xl border border-dashed border-slate-700">
            {/* Custom Tailwind overrides using UploadThing's built-in UT classes */}
            <UploadButton
              endpoint="deliveryPhoto"
              appearance={{
                button: "bg-indigo-600 hover:bg-indigo-500 font-bold text-sm",
                allowedContent: "text-slate-500 text-xs mt-2"
              }}
              onClientUploadComplete={(res) => {
                if (res?.[0]) setPhotoUrl(res[0].url);
              }}
              onUploadError={(error: Error) => {
                alert(`Upload failed: ${error.message}`);
              }}
            />
          </div>
        )}
      </div>

      {/* Signature Section */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md shadow-xl flex flex-col items-center w-full">
        <h2 className="text-lg font-bold text-white mb-1 w-full text-left">Client Signature</h2>
        <p className="text-xs text-slate-400 mb-4 w-full text-left">Please review the delivery and sign below.</p>
        
        <SignaturePad jobId={jobId} onSave={handleSignatureSave} />
      </div>
    </div>
  );
}
