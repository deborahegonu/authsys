import { SignInForm } from "@/blocks";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { providerMap, signIn } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

const SIGNIN_ERROR_URL = "/error"

export default function Page(props:  {
  searchParams: { callbackUrl: string | undefined }
}) {
    return(
        <main className="">
            <h1 className="text-4xl font-bold">Sign in to aSystems</h1>
            <div className="pt-4 pb-6">
                <p>Don&apos;t have an account? <Link href={'/sign-up'} className="text-blue-500 hover:underline">Sign up here</Link></p>
            </div>
            <SignInForm />
            <hr className="my-4" />
            {Object.values(providerMap).map((provider) => (
                <form key={provider.id} action={async () => {
                    'use server'
                    try {
                    await signIn(provider.id, {
                        redirectTo: props.searchParams?.callbackUrl ?? "",
                    })
                    } catch (error) {
                    if(error instanceof AuthError) {
                        return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`)
                    }
                    throw error
                    }
                }}>

                    <Button variant='outline' type="submit">
                    Sign in with {provider.name}
                    </Button>
                </form>
            ))}
        </main>
    )
}