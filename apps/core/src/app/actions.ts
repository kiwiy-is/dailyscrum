"use server";

export async function verifyPassword(password: string) {
  return password === process.env.STAGING_SITE_PROTECTION_PASSWORD;
}
