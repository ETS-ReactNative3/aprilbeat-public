import { useState, useEffect } from "react"
import { supabase } from '@/clients/supabasePublic'
import { useRouter } from "next/router"

export default function SignupVerify(props) {

    const router = useRouter()
    const [signedUp, setSignedUp] = useState(false)
    const [signedUpMessage, setSignedUpMessage] = useState('Loading Authentication')
    const auth = supabase.auth

    useEffect(() => {
        setSignedUpMessage('Please wait, as we finish signing you up. 💖')
        const parsedHash = new URLSearchParams(
            window.location.hash.substr(1) // skip the first char (#)
        );

        const errorcode = parsedHash.get('error_code')
        console.log(errorcode)
        if (errorcode) {
            const errormessage = parsedHash.get('error_description')
            setSignedUpMessage(`Error ${errorcode}: ${errormessage}`)
            return
        }

        const accesstoken = parsedHash.get('access_token')
        console.log(accesstoken, parsedHash)
        auth.onAuthStateChange((event, session) => {
            if (session?.user) {
                setSignedUpMessage('All done! Successfully signed in and will redirect you back soon. 🔮')

                setTimeout(() => {
                    router.replace('/game')
                }, 4500)
            } else {
                setSignedUpMessage('Whoops, seems like something went wrong and we were unable to finish the registration. Please try again in a few moments. 😭')
            }
        })
        if (accesstoken) auth.setAuth(accesstoken)
    }, [])

    return (
        <div className={`w-full h-full min-h-screen flex justify-center items-center`}>
            {signedUpMessage}
        </div>
    )
}