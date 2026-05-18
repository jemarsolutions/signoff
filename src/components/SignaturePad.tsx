"use client";

import { useRef, useState, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";

interface SignaturePadProps {
  jobId: string;
  onSave: (signatureDataUrl: string) => Promise<void>;
}

export function SignaturePad({ jobId, onSave }: SignaturePadProps) {
  const padRef = useRef<SignatureCanvas>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Resize canvas to fit container on mount and window resize
  useEffect(() => {
    const resizeCanvas = () => {
      if (wrapperRef.current && padRef.current) {
        const canvas = padRef.current.getCanvas();
        // Set actual canvas size to match the wrapper size to prevent stretching
        canvas.width = wrapperRef.current.offsetWidth;
        canvas.height = wrapperRef.current.offsetHeight;
        padRef.current.clear(); // clearing ensures no skewed lines remain
      }
    };
    
    // Initial resize with a tiny timeout to ensure DOM is fully painted
    setTimeout(resizeCanvas, 50);
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  const handleClear = () => {
    padRef.current?.clear();
  };

  const handleSave = async () => {
    if (padRef.current?.isEmpty()) {
      alert("Please provide a signature first.");
      return;
    }

    const dataUrl = padRef.current?.getTrimmedCanvas().toDataURL("image/png");
    if (dataUrl) {
      setIsSaving(true);
      try {
        // Convert Base64 data URL to a File object
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], `signature-${jobId}.png`, { type: "image/png" });
        
        // Dynamically import the upload helper to prevent SSR issues
        const { uploadFiles } = await import("@/utils/uploadthing");
        
        // Upload to UploadThing using the 'signatureImage' endpoint
        const [res] = await uploadFiles("signatureImage", { files: [file] });
        
        if (res?.url) {
          await onSave(res.url);
        } else {
          throw new Error("Upload failed, no URL returned.");
        }
      } catch (err) {
        console.error("Failed to save signature", err);
        alert("An error occurred while uploading. Please try again.");
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div 
        ref={wrapperRef} 
        className="w-full h-64 sm:h-80 bg-white rounded-2xl shadow-inner border-2 border-slate-200 overflow-hidden relative cursor-crosshair touch-none"
      >
        <SignatureCanvas
          ref={padRef}
          penColor="#0f172a"
          canvasProps={{ className: "w-full h-full" }}
        />
        <div className="absolute bottom-4 left-0 right-0 pointer-events-none flex justify-center opacity-30">
          <span className="font-serif italic text-2xl tracking-widest text-slate-800">Sign Here</span>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleClear}
          disabled={isSaving}
          className="flex-1 py-3.5 px-4 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-colors disabled:opacity-50"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="flex-[2] flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-colors disabled:opacity-70 disabled:cursor-wait"
        >
          {isSaving ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            "Complete Delivery"
          )}
        </button>
      </div>
    </div>
  );
}
