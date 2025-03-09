import authConfig from "./auth.config";
import NextAuth from "next-auth";

export const config = {
    matcher: '/my-account/:path*'
}

// export { auth as middleware } from "@/auth"
export const { auth: middleware } = NextAuth(authConfig)