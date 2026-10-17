import { createClient } from "@/lib/supabase/server";
import { Profile } from "@/types";

export interface CurrentAuth {
  user: {
    id: string;
    email?: string;
  } | null;
  profile: Profile | null;
  isAdmin: boolean;
}

/**
 * Retrieves the current authenticated user and validates their application profile and role.
 * Sensitive mutations MUST independently call this function to verify admin status on the server.
 */
export async function getCurrentAuth(): Promise<CurrentAuth> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { user: null, profile: null, isAdmin: false };
    }

    // Query application profile for the verified auth.user
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return {
        user: { id: user.id, email: user.email },
        profile: null,
        isAdmin: false,
      };
    }

    const typedProfile = profile as Profile;
    return {
      user: { id: user.id, email: user.email },
      profile: typedProfile,
      isAdmin: typedProfile.role === "admin",
    };
  } catch (error) {
    console.error("Authentication check error:", error);
    return { user: null, profile: null, isAdmin: false };
  }
}

/**
 * Ensures the caller is an authenticated administrator.
 * Throws an explicit error if unauthorized.
 */
export async function requireAdmin(): Promise<CurrentAuth> {
  const auth = await getCurrentAuth();
  if (!auth.user) {
    throw new Error("Unauthorized: Authentication required.");
  }
  if (!auth.isAdmin) {
    throw new Error("Forbidden: Administrator privileges required.");
  }
  return auth;
}
