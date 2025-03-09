
import Link from "next/link"
import { auth } from "@/auth"
import { SignOutBtn } from "@/blocks/auth/SignOutBtn";
import { SignInBtn } from "@/blocks/auth/SignInBtn";

export const Header = async () => {
    const session = await auth();

    return(
        <header>
            <nav className="flex items-center justify-between px-12 py-5 border-b">
                <Link href={'/'}>aSystems</Link>
                <div>
                    {!session?.user ? <SignInBtn /> :<SignOutBtn />}
                </div>
            </nav>
        </header>
    )
}