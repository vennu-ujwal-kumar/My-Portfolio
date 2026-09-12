import { useEffect, useState } from "react";
import defaultPhoto from "@/assets/ujwal.jpg.asset.json";

const PHOTO_KEY = "ujv-custom-photo";
const PHOTO_NAME_KEY = "ujv-custom-photo-name";

export function getStoredPhoto(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(PHOTO_KEY);
  } catch {
    return null;
  }
}

export function getStoredPhotoName(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(PHOTO_NAME_KEY);
  } catch {
    return null;
  }
}

export function saveStoredPhoto(urlOrData: string, name?: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PHOTO_KEY, urlOrData);
    if (name) {
      localStorage.setItem(PHOTO_NAME_KEY, name);
    }
    window.dispatchEvent(new Event("photo-updated"));
  } catch (err) {
    console.error("Failed to save photo", err);
  }
}

export function removeStoredPhoto(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(PHOTO_KEY);
    localStorage.removeItem(PHOTO_NAME_KEY);
    window.dispatchEvent(new Event("photo-updated"));
  } catch {}
}

export function processImageFile(file: File, maxDim = 1200, quality = 0.88): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function useProfilePhoto() {
  const [photoUrl, setPhotoUrl] = useState<string>(() => {
    return getStoredPhoto() || defaultPhoto.url;
  });
  const [photoName, setPhotoName] = useState<string | null>(() => {
    return getStoredPhotoName() || (getStoredPhoto() ? "Custom Photo" : "Default Photo (ujwal.jpg)");
  });
  const [isCustom, setIsCustom] = useState<boolean>(() => {
    return !!getStoredPhoto();
  });

  useEffect(() => {
    const handleUpdate = () => {
      const stored = getStoredPhoto();
      setPhotoUrl(stored || defaultPhoto.url);
      setPhotoName(getStoredPhotoName() || (stored ? "Custom Photo" : "Default Photo (ujwal.jpg)"));
      setIsCustom(!!stored);
    };
    window.addEventListener("photo-updated", handleUpdate);
    return () => window.removeEventListener("photo-updated", handleUpdate);
  }, []);

  return {
    photoUrl,
    photoName,
    isCustom,
    updatePhoto: saveStoredPhoto,
    removePhoto: removeStoredPhoto,
    defaultUrl: defaultPhoto.url,
  };
}
