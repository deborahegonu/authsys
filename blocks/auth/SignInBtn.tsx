import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LuUser } from "react-icons/lu";


export const SignInBtn = () => {
    return(
        <Link href={'/sign-in'}>
            <Button variant={'ghost'}><LuUser /> Sign in | Sign up</Button>
        </Link>
    )
}