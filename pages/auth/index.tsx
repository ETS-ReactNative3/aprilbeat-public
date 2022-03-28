import { supabase } from "@/clients/supabasePublic"
import { useEffect, useState } from "react"
import Dialog from "@/components/DialogComponent"
import { useRouter } from "next/router"
import { apifetch } from "@/clients/apiPublic"


export default function AuthIndex(props) {

    const [isVerifyEmailShown, setIsVerifyEmailShown] = useState(false)
    const [signInWithEmailShown, setSignInWithEmailShown] = useState(false)
    const [signUpIsShown, setSignUpIsShown] = useState(false)
    const [isDialogShown, setIsDialogShown] = useState(false)
    const [dialogTitle, setDialogTitle] = useState('')
    const [dialogDescription, setDialogDescription] = useState('')
    const [dialogDismissable, setDialogDismissable] = useState(true)

    const router = useRouter()

    useEffect(() => {
        const auth = supabase.auth

        if (auth.user() && router.isReady) {
            router.replace('/learn/overview')
        }

        auth.onAuthStateChange(() => {
            if (auth.user() && router.isReady) {
                router.replace('/learn/overview')
            }
        })
    }, [router.isReady])

    // useEffect(() => {
    //     globalThis.a = supabase.auth
    // }, [])

    async function signInWithEmail() {
        const email = (document.getElementById('email') as HTMLInputElement).value
        const password = (document.getElementById('password') as HTMLInputElement).value

        if (!email || !password) {
            setDialogTitle('Email and Password Required')
            setDialogDescription('Please enter an email address and password.')
            setIsDialogShown(true)
            return
        }

        setDialogTitle('Signing In with Email...')
        setDialogDescription(`This won't take long.`)
        setDialogDismissable(false)
        setIsDialogShown(true)

        const authdets = await supabase.auth.signIn({ email: email, password: password })
        if (authdets.error) {
            console.log(authdets.error)
            setDialogTitle('Unable to Sign In')
            setDialogDescription(`${authdets.error.message}`)
            setDialogDismissable(true)
            setIsDialogShown(true)
            return
        }
        router.replace('/learn/overview')
    }

    async function signUpWithEmail() {
        const username = (document.getElementById('username') as HTMLInputElement).value
        const email = (document.getElementById('email') as HTMLInputElement).value
        const password = (document.getElementById('password') as HTMLInputElement).value

        if (!username || !email || !password) {
            setDialogTitle('Email, Username, and Password Required')
            setDialogDescription('Please enter an email address and password.')
            setIsDialogShown(true)
            return
        }

        setDialogTitle('Signing Up with Email...')
        setDialogDescription(`This won't take long.`)
        setDialogDismissable(false)
        setIsDialogShown(true)

        await apifetch('/user/signup', {
            body: {
                email: email,
                password: password,
                username: username
            },
            json: true,
            method: 'POST'
        })
        .catch((error) => {
            setDialogTitle('Unable to Sign Up')
            setDialogDescription(`${error.reason} - Dialog will close in 10 seconds`)

            setTimeout(() => {
                router.reload()
            }, 8000)
        })

        setIsDialogShown(false)
        setIsVerifyEmailShown(true)
    }

    return (
        <div className={`h-screen w-screen min-h-screen`}>

        <Dialog
        state={isDialogShown}
        stateSetter={setIsDialogShown}
        title={dialogTitle}
        description={dialogDescription}
        dismissable={dialogDismissable}
        />

            <div className={`flex h-full w-full`}>
                <div className={`bg-white flex items-center justify-center text-center h-full w-full px-7 lg:px-5 lg:w-3/4`}>

                <div className={`${isVerifyEmailShown ? 'block' : 'hidden'}`}>
                    <h1 className={`text-2xl font-semibold`}>Check your email 💖</h1>
                    <div className={`flex text-center w-full justify-center space-x-1 mt-2`}>
                        <h3>{`If the email you entered has not been signed up before, Click on the verification link sent to your email to continue. 🪐`}</h3>
                    </div>
                </div>

                    <div className={`${isVerifyEmailShown ? 'hidden' : 'block'}`}>
                        <div className={`${signInWithEmailShown ? 'hidden' : 'flex flex-col'}`}>
                            <h1 className={`text-2xl font-semibold`}>Welcome to aprilbeat</h1>

                            <div className={`flex text-center w-full justify-center space-x-1 mt-2`}>
                                <h3>{`Don't have an account?`}</h3>

                                <button>
                                    <h3 className={`text-blue-400 hover:underline`}>{`Sign up for free.`}</h3>
                                </button>
                            </div>

                            <button className={`mt-7 bg-gray-500 hover:bg-gray-600 cursor-not-allowed transition-all text-white py-2 px-14 rounded-xl shadow`}>
                                <h1>Continue with lavauth (not available)</h1>
                            </button>

                            <button onClick={() => setSignInWithEmailShown(true)} className={`mt-3 text-blue-400 rounded-xl`}>
                                <h1 className={`hover:underline`}>Sign in / Sign Up with Email</h1>
                            </button>
                        </div>


                        <div className={`${signInWithEmailShown ? 'flex flex-col' : 'hidden'}`}>
                            <h1 className={`text-2xl font-semibold`}>Welcome to aprilbeat</h1>

                            <div className={`flex text-center w-full justify-center space-x-1 mt-2`}>
                                <h3 className={``}>{signUpIsShown ? 'Have a aprilbeat account?' : `Don't have an account?`}</h3>

                                <button onClick={() => setSignUpIsShown(!signUpIsShown)}>
                                    <h3 className={`text-blue-400 hover:underline`}>{signUpIsShown ? 'Sign in here' : `Sign up for free.`}</h3>
                                </button>
                            </div>

                            <div className="flex flex-col space-y-3 justify-start text-left mt-5">

                                <div className={`${signUpIsShown ? 'block' : 'hidden'}`}>
                                    <h1>Username</h1>
                                    <input
                                        type="text"
                                        name="username"
                                        id="username"
                                        placeholder="Username"
                                        className="mt-1 px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm bg-indigo-50 border-gray-300 rounded-xl"
                                    />
                                </div>

                                <div>
                                    <h1>Email Address</h1>
                                    <input
                                        type="text"
                                        name="email"
                                        id="email"
                                        placeholder="Email Address"
                                        className="mt-1 px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm bg-indigo-50 border-gray-300 rounded-xl"
                                    />
                                </div>


                                <div className={``}>
                                    <h1>Password</h1>
                                    <input
                                        type="password"
                                        name="password"
                                        id="password"
                                        autoComplete="current-password"
                                        security="true"
                                        required
                                        placeholder="Password"
                                        className="appearance-none mt-1 px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm bg-indigo-50 border-gray-300 rounded-xl"
                                    />
                                </div>

                                <div className={`mt-5`}>
                                    <button
                                    onClick={signUpIsShown ? signUpWithEmail : signInWithEmail}
                                    type="submit"
                                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                    { signUpIsShown ? 'Sign Up' : 'Sign in' }
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`bg-blue-500 h-full w-1/3 hidden lg:block`}>

                </div>
            </div>
        </div>
    )
}