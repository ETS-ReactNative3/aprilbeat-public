import { useState, useEffect } from "react"
import { supabase } from '@/clients/supabasePublic'
import { useRouter } from "next/router"

export default function SignupVerify(props) {

    const router = useRouter()
    const [signedUpMessage, setSignedUpMessage] = useState('Loading Authentication')
    const auth = supabase.auth

    useEffect(() => {
        setSignedUpMessage('Please wait, as we finish signing you up. 💖')
        const parsedHash = new URLSearchParams(
            window.location.hash.split('#')[1] // skip the first char (#)
        );

        const errorcode = parsedHash.get('error_code')
        console.log(errorcode)
        if (errorcode) {
            const errormessage = parsedHash.get('error_description')
            setSignedUpMessage(`Error ${errorcode}: ${errormessage}`)
            return
        }

        const accesstoken = parsedHash.get('access_token')
        let failedtimeout
        console.log(accesstoken, parsedHash)
        if (!accesstoken) {
            setSignedUpMessage(`Aprilbeat can't seem to find the token attached, please try requesting a new email verification link again in a few moments. 🏖`)
        }
        auth.onAuthStateChange((event, session) => {
            if (session?.user) {
                setSignedUpMessage('All done! Successfully signed in and will redirect you back soon. 🔮')

                setTimeout(() => {
                    router.replace('/game')
                }, 4500)
            } else {
                setSignedUpMessage('Whoops, seems like something went wrong and we were unable to finish the registration. Try logging in and see if it works!')
            }
        })
        if (accesstoken) auth.setAuth(accesstoken)

        failedtimeout = setTimeout(() => {
            setSignedUpMessage('Whoops, seems like something went wrong and we were unable to finish the registration. Please try again in a few moments. 😭')
        }, 5000)
    }, [])

    return (
        <div className={`w-full h-full min-h-screen text-md md:text-xl xl:text-2xl flex justify-center items-center px-5 text-center`}>
            {signedUpMessage}
        </div>
    )
}