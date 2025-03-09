import { Button } from "@/components/ui/button"
import { signIn } from "@/auth"

export const CredentialsSignIn = () => {

    return(
        <form
            action={async (formData) => {
                "use server"
                try{
                    console.log('Sign in Page', formData)
                    await signIn("credentials", formData, { redirectTo: '/my-account' })
                } catch(error) {
                    throw error
                }
                
            }}
            >
            <label>
                Email
                <input name="email" type="email" />
            </label>
            <label>
                Password
                <input name="password" type="password" />
            </label>
            <Button>Sign In</Button>
      </form>
    )
    
}