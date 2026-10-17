"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export interface AuthActionResult {
  success: boolean;
  error?: string;
}

export async function loginAction(
  prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const email = formData.get("email")?.toString().trim();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return { success: false, error: "Email and password are required." };
  }

  try {
    const supabase = await createClient();
    const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !authData.user) {
      return {
        success: false,
        error: signInError?.message || "Invalid email or password credentials.",
      };
    }

    // Verify whether this user is registered as an administrator
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", authData.user.id)
      .single();

    if (profileError || !profile || profile.role !== "admin") {
      // User is authenticated, but lacks admin authorization
      await supabase.auth.signOut();
      return {
        success: false,
        error: "Access Denied: This account does not possess administrator privileges.",
      };
    }

    revalidatePath("/admin", "layout");
  } catch (error) {
    console.error("Login action error:", error);
    return {
      success: false,
      error: "An unexpected error occurred during authentication. Please check system configuration.",
    };
  }

  redirect("/admin/products");
}

export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/admin/login");
}
