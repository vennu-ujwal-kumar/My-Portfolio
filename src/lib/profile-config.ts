import { useEffect, useState } from "react";

export interface ProfileConfig {
  photoUrl?: string;
  resumeUrl?: string;
  updatedAt?: string;
}

const GITHUB_REPO = "vennu-ujwal-kumar/My-Portfolio";
export const GITHUB_EDIT_CONFIG_URL = `https://github.com/${GITHUB_REPO}/edit/main/public/profile-config.json`;
const CONFIG_RAW_URL = `https://raw.githubusercontent.com/${GITHUB_REPO}/main/public/profile-config.json`;

const GITHUB_TOKEN_KEY = "ujv-admin-gh-token";

export function getStoredGitHubToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(GITHUB_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function saveStoredGitHubToken(token: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(GITHUB_TOKEN_KEY, token);
  } catch {}
}

export function removeStoredGitHubToken(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(GITHUB_TOKEN_KEY);
  } catch {}
}

/**
 * Fetch global config from GitHub Raw (with local fallback)
 */
export async function fetchGlobalConfig(): Promise<ProfileConfig | null> {
  try {
    // Cache-bust by timestamp to ensure instant updates
    const res = await fetch(`${CONFIG_RAW_URL}?t=${Date.now()}`);
    if (res.ok) {
      return await res.json();
    }
  } catch {}

  try {
    const localRes = await fetch(`/profile-config.json?t=${Date.now()}`);
    if (localRes.ok) {
      return await localRes.json();
    }
  } catch {}

  return null;
}

/**
 * Update profile-config.json on GitHub via Personal Access Token
 */
export async function syncConfigToGitHub(
  token: string,
  updates: { photoUrl?: string; resumeUrl?: string }
): Promise<{ success: boolean; error?: string }> {
  try {
    const apiUrl = `https://api.github.com/repos/${GITHUB_REPO}/contents/public/profile-config.json`;

    // 1. Get current file sha
    const getRes = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    let sha: string | undefined;
    let currentConfig: ProfileConfig = {};

    if (getRes.ok) {
      const data = await getRes.json();
      sha = data.sha;
      try {
        currentConfig = JSON.parse(atob(data.content.replace(/\s/g, "")));
      } catch {}
    }

    // 2. Merge updates
    const newConfig: ProfileConfig = {
      ...currentConfig,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // 3. Commit new content
    const putRes = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "feat: update portfolio photo and resume config",
        content: btoa(unescape(encodeURIComponent(JSON.stringify(newConfig, null, 2)))),
        sha,
      }),
    });

    if (!putRes.ok) {
      const errData = await putRes.json();
      return { success: false, error: errData.message || "Failed to commit to GitHub" };
    }

    // Save token for next time
    saveStoredGitHubToken(token);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Network error while saving to GitHub" };
  }
}
