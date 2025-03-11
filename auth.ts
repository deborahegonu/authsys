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
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production"
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  
  session: {
    strategy: "database",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    updateAge: 24 * 60 * 60,  // Update session every 24 hours
    ...authConfig
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try{
        let linkedAcct = null;
        if (account?.provider !== "credentials") {
          // check if a user with this email already exists
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          });
  
          if (existingUser) {
            // Link the OAuth account to the existing user
            await prisma.account.upsert({
              where: {
                provider_providerAccountId: {
                  provider: account?.provider,
                  providerAccountId: account?.providerAccountId
                },
              },
              update:{},
              create: {
                userId: existingUser.id,
                provider: account?.provider,
                providerAccountId: account?.providerAccountId,
                type: account?.type,
                access_token: account?.access_token,
                id_token: account?.id_token,
                scope: account?.scope,
                expires_at: account?.expires_at,
                token_type: account?.token_type,
                refresh_token: account?.refresh_token
              }
            });

            
            user = existingUser;
            linkedAcct = existingUser;
            // update user profile in db
          if(linkedAcct !== null) {
            const updatedProfile = await prisma.user.update({
              where: { email: linkedAcct.email },
              data: {
                name: profile?.name,
                emailVerified: profile?.email_verified,
                image: profile?.picture,
              }
            })

            console.log('Updated user:', updatedProfile)
            return true
          }
            return true;
          }

         
          

          

        }
        return true;
      } catch (error) {
        console.error("SignIn Error", error);
        return false
      }
      
    },
    jwt({ token, user }) {
      if (user) { // User is available during sign-in
        token.id = user.id
      }
      return token
    },
    session({ session, user }) {
      if(user) {
        session.user.id = user.id;
      }
      return session
    },
  },
  secret: process.env.AUTH_SECRET
})