import NextAuth from "next-auth"
import { ZodError } from "zod"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { signInSchema } from "./lib/zod"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/prisma"

import type { User } from "@prisma/client";
import { compare } from "bcrypt";
import authConfig from "./auth.config"
import type { Provider } from "next-auth/providers"


const providers: Provider[] = [
  Credentials({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials): Promise<User | null> {
      try{
        let user = null;

        const { email, password } = await signInSchema.parseAsync(credentials);
        console.log('Auth page', credentials)
        user = await prisma.user.findUnique({
          where: { email: email }
        })

        if(!user) {
          return null
        }

        const passwordMatch = compare(password, user.password)

        if(!passwordMatch) {
          throw new Error("Invalid credentials.")
        }

        return user
      } catch(error) {
        if (error instanceof ZodError) {
          return null
        }
      }
    },
  }),
  Google,
]

export const providerMap = providers
.map((provider) => {
  if (typeof provider === "function") {
    const providerData = provider()
    return { id: providerData.id, name: providerData.name }
  } else {
    return { id: provider.id, name: provider.name}
  }
}).filter((provider) => provider.id !== "credentials")

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: '/sign-in',
    error: '/error',
  },
  providers,
  session: {
    strategy: "jwt",
    ...authConfig
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) { // User is available during sign-in
        token.id = user.id
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.id
      return session
    },
    async redirect({url, baseUrl}) {
      if(url.startsWith("/")) return `${baseUrl}/my-account`;

      return baseUrl
    }
  },
  // callbacks: {
  //   jwt({ token, user }) {
  //     if (user) { // User is available during sign-in
  //       token.id = user.id
  //     }
  //     return token
  //   },
  //   session({ session, token, user }) {
  //     user.id = token.id
  //     return session
  //   },
  // },
})