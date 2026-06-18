"use server";

import { createClient } from "@/lib/supabase/server";
import { authSchema } from "@/lib/validations";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const validated = authSchema.safeParse({ email, password });

  if (!validated.success) {
    return { error: validated.error.errors[0].message };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/");
}

export async function signup(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const validated = authSchema.safeParse({ email, password });

  if (!validated.success) {
    return { error: validated.error.errors[0].message };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user?.email) {
    // Sync to Prisma User table
    await prisma.user.upsert({
      where: { email: data.user.email },
      update: {},
      create: {
        id: data.user.id,
        email: data.user.email,
      },
    });
  }

  redirect("/");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
