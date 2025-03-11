'use client'

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useState } from "react";
import {LuLoaderCircle} from "react-icons/lu"
import { toast } from "sonner";

interface GoogleSignInProps {
    children: React.ReactNode
}

export function GoogleSignIn ({children} : GoogleSignInProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    
    const loginWithGoogle =async () => {
        try {
            setIsLoading(true);
            await signIn('google', { callbackUrl: 'http://localhost:3000/my-account'})
        } catch(error) {
            setIsLoading(false)
            console.log(error)
            toast('Something went wrong')
        } finally {
            setIsLoading(false)
        }
        
    }
    return (
    <Button  
    disabled={isLoading}
    onClick={loginWithGoogle}
    className="min-w-sm">
        {isLoading &&   <LuLoaderCircle className="animate-spin" />}
        {children}
    </Button>
)
}

