import { auth } from "@/auth"

export default async function MyAccountPage() {
    const session = await auth()

    console.log(session)
    if (!session?.user) {
        return(
            <p>Please log in to view your account.</p>
        )
    }
    return(
        <main>
            <h1>My Account</h1>
            <p>Hello user:{session.user?.email}</p>
        </main>
    )
}