import {
  Camera,
  Check,
  Eye,
  FileText,
  Image as ImageIcon,
  KeyRound,
  Lock,
  LogOut,
  RefreshCw,
  Trash2,
  Upload,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { processImageFile, useProfilePhoto } from "@/lib/profile-photo";
import { useResume } from "@/lib/resume";
import { cn } from "@/lib/utils";
import { Pill } from "./primitives";

const DEFAULT_PIN = "2007";
const AUTH_SESSION_KEY = "ujv-admin-authenticated";

export function AdminPortal({
  open,
  onOpenChange,
  initialSection = "resume",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialSection?: "resume" | "photo";
}) {
  const { resumeUrl, fileName, updateResume, removeResume } = useResume();
  const { photoUrl, photoName, isCustom, updatePhoto, removePhoto } = useProfilePhoto();

  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  // Section: Resume or Photo
  const [managerSection, setManagerSection] = useState<"resume" | "photo">(initialSection);

  // Resume state
  const [cloudUrl, setCloudUrl] = useState("");
  const [resumeSuccess, setResumeSuccess] = useState(false);
  const [resumeTab, setResumeTab] = useState<"upload" | "link">("upload");

  // Photo state
  const [cloudPhotoUrl, setCloudPhotoUrl] = useState("");
  const [photoSuccess, setPhotoSuccess] = useState(false);
  const [photoTab, setPhotoTab] = useState<"upload" | "link">("upload");
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuth = sessionStorage.getItem(AUTH_SESSION_KEY) === "true";
      setAuthenticated(isAuth);
    }
  }, []);

  useEffect(() => {
    if (open) {
      setManagerSection(initialSection);
    }
  }, [open, initialSection]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() === DEFAULT_PIN) {
      setAuthenticated(true);
      setPinError(false);
      setPin("");
      if (typeof window !== "undefined") {
        sessionStorage.setItem(AUTH_SESSION_KEY, "true");
      }
    } else {
      setPinError(true);
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(AUTH_SESSION_KEY);
    }
  };

  // Resume Upload
  const handleResumeFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      updateResume(dataUrl, file.name);
      setResumeSuccess(true);
      setTimeout(() => setResumeSuccess(false), 3000);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveResumeCloudUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cloudUrl.trim()) return;

    let finalUrl = cloudUrl.trim();
    if (finalUrl.includes("drive.google.com/file/d/")) {
      const match = finalUrl.match(/\/d\/([^/]+)/);
      if (match && match[1]) {
        finalUrl = `https://drive.google.com/file/d/${match[1]}/preview`;
      }
    }

    updateResume(finalUrl, "Cloud Resume (Google Drive / Online)");
    setCloudUrl("");
    setResumeSuccess(true);
    setTimeout(() => setResumeSuccess(false), 3000);
  };

  // Photo Upload
  const handlePhotoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (JPG, PNG, WebP).");
      return;
    }

    try {
      setIsProcessingPhoto(true);
      // Auto-compress and scale image via canvas to ensure fast load & browser storage fit
      const optimizedDataUrl = await processImageFile(file, 1200, 0.88);
      updatePhoto(optimizedDataUrl, file.name);
      setPhotoSuccess(true);
      setTimeout(() => setPhotoSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to process photo", err);
      alert("Could not process this image. Please try another one.");
    } finally {
      setIsProcessingPhoto(false);
    }
  };

  const handleSaveCloudPhotoUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cloudPhotoUrl.trim()) return;

    let finalUrl = cloudPhotoUrl.trim();
    // Normalize Google Drive image link to high-res direct thumbnail
    if (finalUrl.includes("drive.google.com/file/d/")) {
      const match = finalUrl.match(/\/d\/([^/]+)/);
      if (match && match[1]) {
        finalUrl = `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1200`;
      }
    }

    updatePhoto(finalUrl, "Cloud Profile Photo");
    setCloudPhotoUrl("");
    setPhotoSuccess(true);
    setTimeout(() => setPhotoSuccess(false), 3000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="scrollbar-thin max-h-[90vh] w-[min(94vw,640px)] max-w-none overflow-y-auto rounded-3xl border-border bg-card p-6 sm:p-8">
        {!authenticated ? (
          <div>
            <DialogHeader className="text-left">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary mb-3">
                <Lock className="h-5 w-5" />
              </div>
              <DialogTitle className="font-display text-2xl font-semibold tracking-tight">
                Private Admin Access
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-sm">
                Enter your security PIN to access the private portfolio manager.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleUnlock} className="mt-6 space-y-4">
              <div>
                <label className="font-mono text-xs text-muted-foreground block mb-2">
                  Passcode / PIN
                </label>
                <div className="relative">
                  <input
                    type="password"
                    maxLength={10}
                    value={pin}
                    onChange={(e) => {
                      setPin(e.target.value);
                      setPinError(false);
                    }}
                    placeholder="••••"
                    autoFocus
                    className={cn(
                      "w-full rounded-xl border bg-surface px-4 py-2.5 font-mono text-lg tracking-widest text-foreground outline-none transition-all placeholder:text-muted-foreground/40",
                      pinError ? "border-rose-500 ring-2 ring-rose-500/20" : "border-border focus:border-primary",
                    )}
                  />
                  <KeyRound className="absolute right-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                </div>
                {pinError && (
                  <p className="mt-2 font-mono text-xs text-rose-400">
                    Incorrect PIN. Please try again.
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-primary py-2.5 font-medium text-sm text-primary-foreground shadow transition hover:opacity-90 cursor-pointer"
              >
                Unlock Management Portal
              </button>
            </form>
          </div>
        ) : (
          <div>
            {/* Header with Title & Logout */}
            <DialogHeader className="text-left">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="font-display text-xl font-semibold tracking-tight">
                    Portfolio Admin Manager
                  </DialogTitle>
                  <p className="font-mono text-[11px] text-muted-foreground">
                    Private Portal · Vennu Ujwal
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Lock portal"
                  className="rounded-lg border border-border p-2 text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </DialogHeader>

            {/* Top Section Switcher: Resume vs Photo */}
            <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl border border-border bg-surface p-1 text-xs font-mono">
              <button
                type="button"
                onClick={() => setManagerSection("photo")}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-xl py-2 transition-all cursor-pointer",
                  managerSection === "photo"
                    ? "bg-surface-2 text-foreground font-semibold border border-border shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Camera className="h-4 w-4" />
                <span>Profile Photo</span>
              </button>
              <button
                type="button"
                onClick={() => setManagerSection("resume")}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-xl py-2 transition-all cursor-pointer",
                  managerSection === "resume"
                    ? "bg-surface-2 text-foreground font-semibold border border-border shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <FileText className="h-4 w-4" />
                <span>Resume PDF</span>
              </button>
            </div>

            {/* SECTION 1: PROFILE PHOTO MANAGER */}
            {managerSection === "photo" && (
              <div className="mt-5 space-y-4">
                {/* Active Photo Card */}
                <div className="rounded-2xl border border-border bg-surface p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-glass-border bg-card shadow-sm">
                        <img
                          src={photoUrl}
                          alt="Current active portrait"
                          className="h-full w-full object-cover object-top"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-display text-sm font-medium text-foreground">
                            {isCustom ? "Custom Photo Active" : "Default Photo Active"}
                          </span>
                          <Pill
                            tone={isCustom ? "success" : "neutral"}
                            className="py-0 px-2 text-[10px]"
                          >
                            {isCustom ? "Custom" : "ujwal.jpg"}
                          </Pill>
                        </div>
                        <p className="font-mono text-xs text-muted-foreground truncate max-w-[240px] sm:max-w-[320px]">
                          {photoName || "ujwal.jpg"}
                        </p>
                      </div>
                    </div>

                    {isCustom && (
                      <button
                        type="button"
                        onClick={removePhoto}
                        title="Reset to default photo"
                        className="flex items-center gap-1 rounded-lg border border-border bg-surface-2 px-3 py-1.5 font-mono text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors cursor-pointer"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Reset Default</span>
                      </button>
                    )}
                  </div>
                </div>

                {photoSuccess && (
                  <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 font-mono text-xs text-emerald-400">
                    <Check className="h-4 w-4" />
                    Profile photo updated successfully! The Hero portrait has been refreshed.
                  </div>
                )}

                {/* Upload or Link Photo */}
                <div className="rounded-2xl border border-border bg-surface p-4">
                  <div className="flex border-b border-border text-xs font-mono mb-4">
                    <button
                      type="button"
                      onClick={() => setPhotoTab("upload")}
                      className={cn(
                        "px-4 py-2 border-b-2 transition-colors cursor-pointer",
                        photoTab === "upload"
                          ? "border-primary text-foreground font-medium"
                          : "border-transparent text-muted-foreground hover:text-foreground",
                      )}
                    >
                      Direct Image Upload
                    </button>
                    <button
                      type="button"
                      onClick={() => setPhotoTab("link")}
                      className={cn(
                        "px-4 py-2 border-b-2 transition-colors cursor-pointer",
                        photoTab === "link"
                          ? "border-primary text-foreground font-medium"
                          : "border-transparent text-muted-foreground hover:text-foreground",
                      )}
                    >
                      Cloud Image URL
                    </button>
                  </div>

                  {photoTab === "upload" ? (
                    <div>
                      <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-surface/50 p-6 text-center transition hover:border-primary/50 hover:bg-surface cursor-pointer">
                        <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" strokeWidth={1.5} />
                        <span className="font-display text-sm font-medium text-foreground">
                          {isProcessingPhoto ? "Optimizing image…" : "Click to select a new profile photo"}
                        </span>
                        <span className="mt-1 font-mono text-[11px] text-muted-foreground">
                          Supports JPG, PNG, WebP · Automatically optimized for lightning speed
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={isProcessingPhoto}
                          onChange={handlePhotoFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  ) : (
                    <form onSubmit={handleSaveCloudPhotoUrl} className="space-y-3">
                      <div>
                        <label className="font-mono text-xs text-muted-foreground block mb-1.5">
                          Paste Image URL (Google Drive, Imgur, Cloudinary, etc.)
                        </label>
                        <input
                          type="url"
                          value={cloudPhotoUrl}
                          onChange={(e) => setCloudPhotoUrl(e.target.value)}
                          placeholder="https://drive.google.com/file/d/... or https://..."
                          className="w-full rounded-xl border border-border bg-card px-4 py-2 text-sm text-foreground outline-none transition focus:border-primary"
                        />
                        <p className="mt-1.5 font-mono text-[10px] text-subtle leading-relaxed">
                          💡 Tip: If using Google Drive, share the photo with &quot;Anyone with the link&quot;. It will automatically be converted to a direct high-res image stream.
                        </p>
                      </div>
                      <button
                        type="submit"
                        disabled={!cloudPhotoUrl.trim()}
                        className="rounded-xl bg-primary px-5 py-2 font-medium text-xs text-primary-foreground transition hover:opacity-90 disabled:opacity-40 cursor-pointer"
                      >
                        Set Cloud Profile Photo
                      </button>
                    </form>
                  )}

                  <div className="mt-4 pt-3 border-t border-border">
                    <p className="font-mono text-[11px] text-muted-foreground leading-relaxed">
                      💡 <strong>Git Fallback:</strong> You can also replace <code className="text-foreground">public/images/ujwal.jpg</code> directly in your GitHub repo for a permanent default across all devices.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 2: RESUME MANAGER */}
            {managerSection === "resume" && (
              <div className="mt-5 space-y-4">
                {/* Current Resume Status */}
                <div className="rounded-2xl border border-border bg-surface p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-xl",
                          resumeUrl
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-surface-2 text-muted-foreground border border-border",
                        )}
                      >
                        {resumeUrl ? <Check className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-display text-sm font-medium text-foreground">
                            {resumeUrl ? "Live Resume Active" : "No Resume Configured"}
                          </span>
                          {resumeUrl && (
                            <Pill tone="success" className="py-0 px-2 text-[10px]">
                              Online
                            </Pill>
                          )}
                        </div>
                        <p className="font-mono text-xs text-muted-foreground truncate max-w-[240px] sm:max-w-[320px]">
                          {fileName || (resumeUrl ? "Active resume link" : "Upload a PDF or enter a link below")}
                        </p>
                      </div>
                    </div>

                    {resumeUrl && (
                      <div className="flex items-center gap-1.5">
                        <a
                          href={resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-lg border border-border bg-surface-2 px-3 py-1.5 font-mono text-xs text-foreground hover:border-primary/40 transition-colors inline-flex items-center gap-1"
                        >
                          <Eye className="h-3.5 w-3.5" /> View
                        </a>
                        <button
                          type="button"
                          onClick={removeResume}
                          title="Remove resume"
                          className="rounded-lg border border-border p-2 text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {resumeSuccess && (
                  <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 font-mono text-xs text-emerald-400">
                    <Check className="h-4 w-4" />
                    Resume updated successfully! The Navbar Resume button is now active.
                  </div>
                )}

                {/* Upload Tabs */}
                <div className="rounded-2xl border border-border bg-surface p-4">
                  <div className="flex border-b border-border text-xs font-mono mb-4">
                    <button
                      type="button"
                      onClick={() => setResumeTab("upload")}
                      className={cn(
                        "px-4 py-2 border-b-2 transition-colors cursor-pointer",
                        resumeTab === "upload"
                          ? "border-primary text-foreground font-medium"
                          : "border-transparent text-muted-foreground hover:text-foreground",
                      )}
                    >
                      Direct PDF Upload
                    </button>
                    <button
                      type="button"
                      onClick={() => setResumeTab("link")}
                      className={cn(
                        "px-4 py-2 border-b-2 transition-colors cursor-pointer",
                        resumeTab === "link"
                          ? "border-primary text-foreground font-medium"
                          : "border-transparent text-muted-foreground hover:text-foreground",
                      )}
                    >
                      Cloud URL (Google Drive)
                    </button>
                  </div>

                  {resumeTab === "upload" ? (
                    <div>
                      <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-surface/50 p-6 text-center transition hover:border-primary/50 hover:bg-surface cursor-pointer">
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" strokeWidth={1.5} />
                        <span className="font-display text-sm font-medium text-foreground">
                          Click to choose or drag & drop your resume PDF
                        </span>
                        <span className="mt-1 font-mono text-[11px] text-muted-foreground">
                          Accepts .pdf format (stores locally in your browser storage)
                        </span>
                        <input
                          type="file"
                          accept=".pdf,application/pdf"
                          onChange={handleResumeFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  ) : (
                    <form onSubmit={handleSaveResumeCloudUrl} className="space-y-3">
                      <div>
                        <label className="font-mono text-xs text-muted-foreground block mb-1.5">
                          Paste Public Google Drive / Dropbox / Cloud URL
                        </label>
                        <input
                          type="url"
                          value={cloudUrl}
                          onChange={(e) => setCloudUrl(e.target.value)}
                          placeholder="https://drive.google.com/file/d/.../view"
                          className="w-full rounded-xl border border-border bg-card px-4 py-2 text-sm text-foreground outline-none transition focus:border-primary"
                        />
                        <p className="mt-1.5 font-mono text-[10px] text-subtle leading-relaxed">
                          💡 Tip: Share a Google Drive PDF link with &quot;Anyone with link can view&quot;. When you update your resume in Google Drive, your portfolio will always show the newest version automatically!
                        </p>
                      </div>
                      <button
                        type="submit"
                        disabled={!cloudUrl.trim()}
                        className="rounded-xl bg-primary px-5 py-2 font-medium text-xs text-primary-foreground transition hover:opacity-90 disabled:opacity-40 cursor-pointer"
                      >
                        Save Cloud Resume Link
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}

            {/* Footer Navigation */}
            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs font-mono text-muted-foreground">
              <span>Shortcut to open: Ctrl + Shift + U</span>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="text-primary hover:underline cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
