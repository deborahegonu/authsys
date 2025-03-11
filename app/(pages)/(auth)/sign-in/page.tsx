import { GoogleSignIn, SignInForm } from "@/blocks";
import { DividerText } from "@/components/ui/dividerText";
import Link from "next/link";


export default function Page() {
    return(
        <main className="">
            <h1 className="text-4xl font-bold">Sign in to aSystems</h1>
            <div className="pt-4 pb-6">
                <p>Don&apos;t have an account? <Link href={'/sign-up'} className="text-blue-500 hover:underline">Sign up here</Link></p>
            </div>
            <SignInForm />
            <DividerText />
            <GoogleSignIn>Sign in with Google</GoogleSignIn>
        </main>
    )
}