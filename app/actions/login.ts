"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function login(
  prevState: { error?: string } | undefined,
  formData: FormData
) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    await signIn("credentials", { email, password, redirectTo: "/dashboard" });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password." };
    }
    throw error;
  }
}


// export async function login(formData: FormData) {
//   const email = formData.get("email") as string;
//   const password = formData.get("password") as string;

//   try {
//     await signIn("credentials", { email, password, redirectTo: "/dashboard" });
//   } catch (error) {
//     if (error instanceof AuthError) {
//       throw new Error("Invalid email or password.");
//     }
//     throw error;
//   }
// }
