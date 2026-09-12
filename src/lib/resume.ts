import { useEffect, useState } from "react";
import { personal } from "@/data/portfolio";

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

  useEffect(() => {
    const handleUpdate = () => {
      setResumeUrl(getStoredResume() || personal.resumeUrl);
      setFileName(getStoredResumeName() || (personal.resumeUrl ? "resume.pdf" : null));
    };
    window.addEventListener("resume-updated", handleUpdate);
    return () => window.removeEventListener("resume-updated", handleUpdate);
  }, []);

  return {
    resumeUrl,
    fileName,
    updateResume: saveStoredResume,
    removeResume: removeStoredResume,
  };
}
