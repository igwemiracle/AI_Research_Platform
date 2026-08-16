"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function signup(
  prevState: { error?: string } | undefined,
  formData: FormData
) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return { error: "A user with this email already exists." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { email, password: hashedPassword },
  });

  redirect("/login");
}

// export async function signup(formData: FormData) {
//   const email = formData.get("email") as string;
//   const password = formData.get("password") as string;

//   const existingUser = await prisma.user.findUnique({ where: { email } });
//   if (existingUser) {
//     throw new Error("A user with this email already exists.");
//   }

//   const hashedPassword = await bcrypt.hash(password, 10);
//   await prisma.user.create({
//     data: { email, password: hashedPassword },
//   });

//   redirect("/login");
// }

// ==================================================================================================

