import { auth } from "@/auth"
import { RedirectToSignIn } from "@/blocks/auth/RedirectToSignIn";
import { SignOutBtn } from "@/blocks/auth/SignOutBtn";

interface ProtectedLayoutProps {
    children: React.ReactNode
}

export default function ProtectedLayout({ children } : ProtectedLayoutProps) {
    const session = auth();

    if(!session) {
        return RedirectToSignIn
    }
  return (
    <div className="min-h-[80vh]">
        <div className="px-12 py-5 flex items-center justify-between">
            <span>Protected route</span>
            <SignOutBtn />
        </div>
        {children}
    </div>
  )
}
