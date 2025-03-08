'use client'

import { Button } from "@/components/ui/button";

interface GoogleSignInProps {
    children: React.ReactNode
}

export function GoogleSignIn ({children} : GoogleSignInProps) {
    const googleLogin = () => console.log("Google log in")
    return <Button onClick={googleLogin}>{children}</Button>
}

