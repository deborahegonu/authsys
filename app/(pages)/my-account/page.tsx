import { auth } from "@/auth"
// import { RedirectToSignIn } from "@/blocks/auth/RedirectToSignIn"
import Link from "next/link"

// import { prisma } from "@/prisma"

export default async function MyAccountPage() {
    const session = await auth()
    const user = session?.user
    console.log('account user:', user)
    if (!session) {
        return(
         <p className="text-center">Please <Link href={'/sign-in'} className="underline">sign in</Link> to view your account.</p>
        )
    }
    
    // const user = await prisma.user.findUnique({
    //     where: {
    //         email: 
    //     }
    // })
    return(
        <main>
            <section className="px-12 py-5">
                <h1>My Account</h1>
                <p>User {user?.email}</p>
            </section>
        </main>
    )
}