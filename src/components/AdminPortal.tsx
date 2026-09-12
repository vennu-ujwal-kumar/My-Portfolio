import {
  Camera,
  Check,
  ExternalLink,
  Eye,
  FileText,
  Globe,
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
import {
  GITHUB_EDIT_CONFIG_URL,
  getStoredGitHubToken,
  syncConfigToGitHub,
} from "@/lib/profile-config";
import { processImageFile, useProfilePhoto } from "@/lib/profile-photo";
import { useResume } from "@/lib/resume";
import { cn } from "@/lib/utils";
import { Pill } from "./primitives";

const DEFAULT_PIN = "2007";
const AUTH_SESSION_KEY = "ujv-admin-authenticated";

export function AdminPortal({
  open,
  onOpenChange,
  initialSection = "photo",
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

  // Resume inputs
  const [cloudUrl, setCloudUrl] = useState("");
  const [resumeSuccess, setResumeSuccess] = useState(false);
  const [resumeTab, setResumeTab] = useState<"upload" | "link">("upload");

  // Photo inputs
  const [cloudPhotoUrl, setCloudPhotoUrl] = useState("");
  const [photoSuccess, setPhotoSuccess] = useState(false);
  const [photoTab, setPhotoTab] = useState<"upload" | "link">("upload");
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);

  // GitHub token sync state
  const [ghToken, setGhToken] = useState(() => getStoredGitHubToken() || "");
  const [isSyncingGh, setIsSyncingGh] = useState(false);
  const [ghSyncMsg, setGhSyncMsg] = useState<{ type: "success" | "error"; text: string } | null>(
    null,
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuth = sessionStorage.getItem(AUTH_SESSION_KEY) === "true";
      setAuthenticated(isAuth);
    }
  }, []);

  useEffect(() => {
    if (open) {
      setManagerSection(initialSection);
      setGhSyncMsg(null);
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

  // Resume file upload
  const handleResumeFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload a valid PDF file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      updateResume(dataUrl, file.name);
      setResumeSuccess(true);
      setTimeout(() => setResumeSuccess(false), 3500);
    };
    reader.readAsDataURL(file);
  };

  // Resume cloud link save
  const handleSaveResumeCloudUrl = async (e: React.FormEvent) => {
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

    // If GitHub token is present, automatically sync to GitHub globally!
    if (ghToken.trim()) {
      setIsSyncingGh(true);
      const res = await syncConfigToGitHub(ghToken.trim(), { resumeUrl: finalUrl });
      setIsSyncingGh(false);
      if (res.success) {
        setGhSyncMsg({
          type: "success",
          text: "Synced to GitHub! All devices worldwide will now see your updated resume.",
        });
      } else {
        setGhSyncMsg({ type: "error", text: res.error || "Failed to push to GitHub." });
      }
    }

    setCloudUrl("");
    setResumeSuccess(true);
    setTimeout(() => setResumeSuccess(false), 3500);
  };

  // Photo file upload
  const handlePhotoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file (JPG, PNG, WebP).");
      return;
    }

    try {
      setIsProcessingPhoto(true);
      const optimizedDataUrl = await processImageFile(file, 1200, 0.88);
      updatePhoto(optimizedDataUrl, file.name);
      setPhotoSuccess(true);
      setTimeout(() => setPhotoSuccess(false), 3500);
    } catch (err) {
      console.error("Failed to process photo", err);
      alert("Could not process this image. Please try another one.");
    } finally {
      setIsProcessingPhoto(false);
    }
  };

  // Photo cloud link save
  const handleSaveCloudPhotoUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cloudPhotoUrl.trim()) return;

    const finalUrl = cloudPhotoUrl.trim();
    updatePhoto(finalUrl, "Cloud Profile Photo");

    // If GitHub token is present, automatically sync to GitHub globally!
    if (ghToken.trim()) {
      setIsSyncingGh(true);
      const res = await syncConfigToGitHub(ghToken.trim(), { photoUrl: finalUrl });
      setIsSyncingGh(false);
      if (res.success) {
        setGhSyncMsg({
          type: "success",
          text: "Synced to GitHub! All devices worldwide will now see your new photo.",
        });
      } else {
        setGhSyncMsg({ type: "error", text: res.error || "Failed to push to GitHub." });
      }
    }

    setCloudPhotoUrl("");
    setPhotoSuccess(true);
    setTimeout(() => setPhotoSuccess(false), 3500);
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
                    Profile photo updated successfully in this browser!
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
                          Paste Direct Image URL
                        </label>
                        <input
                          type="url"
                          value={cloudPhotoUrl}
                          onChange={(e) => setCloudPhotoUrl(e.target.value)}
                          placeholder="https://i.ibb.co/... or https://..."
                          className="w-full rounded-xl border border-border bg-card px-4 py-2 text-sm text-foreground outline-none transition focus:border-primary"
                        />
                        <div className="mt-2 rounded-xl bg-surface-2 p-3 text-[11px] font-mono text-subtle space-y-1.5">
                          <p className="text-amber-400/90 font-medium">
                            ⚠️ Why Google Drive links fail for images:
                          </p>
                          <p className="text-muted-foreground leading-relaxed">
                            Google Drive blocks external website image embedding. For photos that work 100% of the time on every phone and computer, upload to{" "}
                            <a
                              href="https://imgbb.com"
                              target="_blank"
                              rel="noreferrer"
                              className="text-primary underline"
                            >
                              ImgBB.com
                            </a>{" "}
                            or{" "}
                            <a
                              href="https://postimages.org"
                              target="_blank"
                              rel="noreferrer"
                              className="text-primary underline"
                            >
                              Postimages.org
                            </a>{" "}
                            (free, 5 sec upload) and paste the <strong>Direct link</strong> ending in .jpg/.png!
                          </p>
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={!cloudPhotoUrl.trim()}
                        className="rounded-xl bg-primary px-5 py-2 font-medium text-xs text-primary-foreground transition hover:opacity-90 disabled:opacity-40 cursor-pointer"
                      >
                        Set Profile Photo
                      </button>
                    </form>
                  )}
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
                          Accepts .pdf format
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
                          💡 Tip: Share a Google Drive PDF link with &quot;Anyone with link can view&quot;. For PDFs, Google Drive links work great!
                        </p>
                      </div>
                      <button
                        type="submit"
                        disabled={!cloudUrl.trim()}
                        className="rounded-xl bg-primary px-5 py-2 font-medium text-xs text-primary-foreground transition hover:opacity-90 disabled:opacity-40 cursor-pointer"
                      >
                        Save Resume Link
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}

            {/* GLOBAL CROSS-DEVICE SYNC SECTION */}
            <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="h-4 w-4 text-primary" />
                <h4 className="font-display text-sm font-semibold text-foreground">
                  Global Sync (All Devices Worldwide)
                </h4>
              </div>
              <p className="font-mono text-xs text-muted-foreground leading-relaxed mb-3">
                Local uploads above only update this single browser. To update your photo and resume for <strong>every recruiter, phone, and computer worldwide</strong>:
              </p>

              <div className="space-y-3">
                {/* Method 1: 1-Click GitHub Web Edit */}
                <div className="rounded-xl border border-border bg-surface p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="font-display text-xs font-semibold text-foreground block">
                      Option A: 1-Click Edit on GitHub (No setup needed)
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground block">
                      Edit public/profile-config.json directly on GitHub and click Commit
                    </span>
                  </div>
                  <a
                    href={GITHUB_EDIT_CONFIG_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-foreground px-3 py-1.5 font-mono text-xs text-background font-medium hover:opacity-90 transition cursor-pointer shrink-0"
                  >
                    <span>Edit on GitHub</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                {/* Method 2: GitHub Token Direct Sync */}
                <div className="rounded-xl border border-border bg-surface p-3">
                  <span className="font-display text-xs font-semibold text-foreground block mb-1">
                    Option B: Sync via GitHub Token
                  </span>
                  <p className="font-mono text-[10px] text-muted-foreground mb-2">
                    Paste a GitHub Personal Access Token (classic or fine-grained with Repo write access) to push updates from this modal directly.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={ghToken}
                      onChange={(e) => setGhToken(e.target.value)}
                      placeholder="ghp_xxxxxxxxxxxx"
                      className="w-full rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-foreground outline-none font-mono"
                    />
                    <button
                      type="button"
                      disabled={!ghToken.trim() || isSyncingGh}
                      onClick={async () => {
                        setIsSyncingGh(true);
                        setGhSyncMsg(null);
                        const updates: { photoUrl?: string; resumeUrl?: string } = {};
                        if (photoUrl && isCustom) updates.photoUrl = photoUrl;
                        if (resumeUrl) updates.resumeUrl = resumeUrl;
                        const res = await syncConfigToGitHub(ghToken.trim(), updates);
                        setIsSyncingGh(false);
                        if (res.success) {
                          setGhSyncMsg({
                            type: "success",
                            text: "Successfully synced to GitHub! Global config is live.",
                          });
                        } else {
                          setGhSyncMsg({
                            type: "error",
                            text: res.error || "Failed to commit to GitHub.",
                          });
                        }
                      }}
                      className="shrink-0 rounded-lg bg-primary px-3 py-1.5 font-mono text-xs text-primary-foreground font-medium hover:opacity-90 disabled:opacity-40 cursor-pointer"
                    >
                      {isSyncingGh ? "Syncing…" : "Sync Now"}
                    </button>
                  </div>
                  {ghSyncMsg && (
                    <p
                      className={cn(
                        "mt-2 font-mono text-[11px]",
                        ghSyncMsg.type === "success" ? "text-emerald-400" : "text-rose-400",
                      )}
                    >
                      {ghSyncMsg.text}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Navigation */}
            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs font-mono text-muted-foreground">
              <span>Shortcut: Ctrl + Shift + U</span>
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
