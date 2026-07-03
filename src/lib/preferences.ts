export type Preferences = {
  skills?: string;
  workMode?: string;
  location?: string;
  experience?: string;
  targetRole?: string;
  resumeUrl?: string;
  [key: string]: unknown;
};

export type SessionUserWithProfile = {
  id: string;
  name?: string | null;
  email?: string | null;
  role?: string | null;
  resumeUrl?: string | null;
  targetRole?: string | null;
  preferences?: unknown;
};

export function parsePreferences(value: unknown): Preferences {
  if (!value) return {};

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return isPreferenceObject(parsed) ? parsed : {};
    } catch {
      return {};
    }
  }

  return isPreferenceObject(value) ? value : {};
}

export function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown error";
}

function isPreferenceObject(value: unknown): value is Preferences {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
