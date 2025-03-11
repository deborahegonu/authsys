import { GoogleSignIn, SignUpForm } from "@/blocks";
import { DividerText } from "@/components/ui/dividerText";
import Link from "next/link";

export default function Page() {
    return(
        <main>
            <h1 className="text-4xl font-bold">Sign up on aSystems</h1>
            <div className="pt-4 pb-6">
                <p>Already have an account? <Link href={'/sign-in'} className="text-blue-500 hover:underline">Sign in here</Link></p>
            </div>
            <SignUpForm />
            <DividerText />
            <GoogleSignIn>Sign up with Google</GoogleSignIn>
        </main>
    )
}