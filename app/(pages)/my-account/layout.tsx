import { SignOutBtn } from "@/blocks/auth/SignOutBtn";

interface ProtectedLayoutProps {
    children: React.ReactNode
}

export default function ProtectedLayout({ children } : ProtectedLayoutProps) {
  return (
    <div className="min-h-[80vh]">
        {children}
    </div>
  )
}
