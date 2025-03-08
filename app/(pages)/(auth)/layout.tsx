interface AuthLayoutProps {
    children: React.ReactNode
}

export default function AuthLayout({ children } : AuthLayoutProps) {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
        {children}
    </div>
  )
}
