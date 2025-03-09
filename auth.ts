import NextAuth, { type DefaultSession } from "next-auth"
import { ZodError } from "zod"
import Credentials from "next-auth/providers/credentials"
import { signInSchema } from "./lib/zod"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/prisma"

import type { User } from "@prisma/client";
import { compare } from "bcrypt";
import authConfig from "./auth.config"

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      address: string
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession["user"]
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: '/sign-in',
    error: '/error',
  },
  providers: [
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
  ],
  session: {
    strategy: "jwt",
    ...authConfig
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