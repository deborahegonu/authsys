'use client'

import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"

export const SignOutBtn = () => {

    return(
        <Button variant={'ghost'} 
        onClick={() => {
            signOut({
                redirectTo: '/sign-in'
            })
        }}>Sign out</Button>
    )
}