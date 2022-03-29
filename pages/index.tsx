import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function AprilbeatIndex(props) {

    const router = useRouter()

    useEffect(() => {
        setTimeout(() => {
            router.replace('/game/preflight')
        }, 500)
    }, [])

    return (
        <div className={`w-full h-full min-h-screen flex justify-center items-center`}>
            <h1 className={`font-medium text-xl`}>Redirecting you to Aprilbeat.</h1>
        </div>
    )
}