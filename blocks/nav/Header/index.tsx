import Link from "next/link"
import { auth } from "@/auth"
import { SignOutBtn } from "@/blocks/auth/SignOutBtn";
import { SignInBtn } from "@/blocks/auth/SignInBtn";
import { LuLockKeyhole } from "react-icons/lu";

export const Header = async () => {
    const session = await auth();

    return(
        <header>
            <nav className="flex items-center justify-between px-12 py-5 border-b">
                <Link href={'/'} className="flex items-center space-x-2 text-xl font-bold">
                    <LuLockKeyhole />
                    <span className="">systems</span>
                </Link>
                { session?.user ? <SignOutBtn /> :<SignInBtn /> }
            </nav>
        </header>
    )
}