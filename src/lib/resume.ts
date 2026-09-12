import { useEffect, useState } from "react";
import { personal } from "@/data/portfolio";
import { fetchGlobalConfig } from "./profile-config";

const RESUME_KEY = "ujv-custom-resume";
const RESUME_NAME_KEY = "ujv-custom-resume-name";

export function getStoredResume(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(RESUME_KEY);
  } catch {
    return null;
  }
}

export function getStoredResumeName(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(RESUME_NAME_KEY);
  } catch {
    return null;
  }
}

export function saveStoredResume(urlOrData: string, fileName?: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(RESUME_KEY, urlOrData);
    if (fileName) {
      localStorage.setItem(RESUME_NAME_KEY, fileName);
    }
    window.dispatchEvent(new Event("resume-updated"));
  } catch (err) {
    console.error("Failed to save resume", err);
  }
}

export function removeStoredResume(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(RESUME_KEY);
    localStorage.removeItem(RESUME_NAME_KEY);
    window.dispatchEvent(new Event("resume-updated"));
  } catch {}
}

export function useResume() {
  const [resumeUrl, setResumeUrl] = useState<string | null>(() => {
    return getStoredResume() || personal.resumeUrl;
  });
  const [fileName, setFileName] = useState<string | null>(() => {
    return getStoredResumeName() || (personal.resumeUrl ? "resume.pdf" : null);
  });

  // 1. Listen for local storage updates
  useEffect(() => {
    const handleUpdate = () => {
      const stored = getStoredResume();
      if (stored) {
        setResumeUrl(stored);
        setFileName(getStoredResumeName() || "Custom Resume");
      } else {
        // Fall back to global config if local cleared
        fetchGlobalConfig().then((cfg) => {
          if (cfg?.resumeUrl) {
            setResumeUrl(cfg.resumeUrl);
            setFileName("Global Resume (Synced across all devices)");
          } else {
            setResumeUrl(personal.resumeUrl);
            setFileName(personal.resumeUrl ? "resume.pdf" : null);
          }
        });
      }
    };
    window.addEventListener("resume-updated", handleUpdate);
    return () => window.removeEventListener("resume-updated", handleUpdate);
  }, []);

  // 2. Fetch global config on mount so ALL devices get the live resume!
  useEffect(() => {
    let active = true;
    fetchGlobalConfig().then((cfg) => {
      if (!active) return;
      const local = getStoredResume();
      if (!local && cfg?.resumeUrl) {
        setResumeUrl(cfg.resumeUrl);
        setFileName("Global Resume (Synced across all devices)");
      }
    });
    return () => {
      active = false;
    };
  }, []);

  return {
    resumeUrl,
    fileName,
    updateResume: saveStoredResume,
    removeResume: removeStoredResume,
  };
}
