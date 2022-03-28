import { motion, useAnimation } from 'framer-motion'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Game() {

    const router = useRouter()
    const welcomeScreenSplashAnimationControl = useAnimation()

    useEffect(() => {
        welcomeScreenSplashAnimationControl.start({
            opacity: 1
        }).then(() => {
            setTimeout(() => {
                welcomeScreenSplashAnimationControl.start({
                    opacity: 0,
                    scale: 0.8,
                    transition: { duration: 0.7 }
                }).then(() => {
                    router.replace('/game')
                })
            }, 1000)
        })
    }, [])

    return (
        <div className={`bg-black w-full h-full min-h-screen noBar`}>
            <motion.div
            initial={{ opacity: 0 }}
            animate={welcomeScreenSplashAnimationControl}
            transition={{ duration: 1, ease: 'easeInOut' }}
            className={`flex flex-col justify-center items-center text-white w-full h-full min-h-screen px-8`}
            >
                    <div className={`flex space-x-1 items-center`}>
                        <h1 className={`font-medium`}>this is</h1>
                        <h3 className={`font-semibold text-lg font-Torus text-pink-300`}>aprilbeat.</h3>
                    </div>
                    <h3 className={`font-medium text-sm text-gray-200`}>the next revolution towards the future of web rythm games.</h3>

                    <div className={`mt-4 text-yellow-200`}>
                        <h3 className={`text-xs`}>This is an early development build, certain things may not work as expected.</h3>
                    </div>

                    <div className={`mt-7 text-center text-gray-300`}>
                        <h1 className={`text-sm font-semibold`}>{`Today's tip:`}</h1>
                        <h3 className={`text-xs`}>Aprilbeat was entirely built with native animations which may allow frame rates to be higher than 120fps</h3>
                    </div>
            </motion.div>
        </div>
    )
}