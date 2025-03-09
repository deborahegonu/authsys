'use client'

import { useRouter } from "next/navigation"

export const RedirectToSignIn = () => {
    const route = useRouter()

    return route.push('/sign-in')
}