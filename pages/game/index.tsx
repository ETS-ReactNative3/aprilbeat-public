import { useEffect, useState } from "react"
import { motion, useAnimation } from 'framer-motion'
import { AppDataProps } from "@/constants/customTypings/app";
import * as lowLag from '@/clients/lowLag'
import { useRouter } from "next/router"

export default function GameIndex({ dataProps }) {

    const router = useRouter()

    const welcomeScreenButtonAnimationControl = useAnimation()
    const welcomeSplashAnimationControl = useAnimation()
    const welcomeTextAnimationControl = useAnimation()
    const welcomeScreenAnimationControl = useAnimation()
    const mainMenuAnimationControl = useAnimation()
    const sideBeatIndicatorAnimationControl = useAnimation()
    const topBarAnimationControl = useAnimation()

    const [currentScreen, setCurrentScreen] = useState('')
    const [welcomeText, setWelcomeText] = useState('')
    const [welcomeSplashVisible, setWelcomeSplashVisible] = useState(true)
    const [welcomeScreenVisible, setWelcomeScreenVisible] = useState(false)
    const [splashStarted, setSplashStarted] = useState(false)
    const [mainMenuVisible, setMainMenuVisible] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)
    const [currentFinalFps, setCurrentFinalFps] = useState('0')
    const { state: inTransition, stateSetter: setInTransition } =
        dataProps.inTransition;
    const { state: audioLoaded, stateSetter: setAudioLoaded } = dataProps.audioLoaded

    async function enterBeatmapMenu() {
        await dataProps.pageTransitionAnimationControl.mount()
        router.replace('/game/play/beatmapselect')
    }

    async function hideMainMenu() {
        if (currentScreen == 'splash') return
        setCurrentScreen('splash')

        topBarAnimationControl.start({
                translateY: -40
        })
        mainMenuAnimationControl.start({
            opacity: 0
        }).then(() => {
            setMainMenuVisible(false)
        })
        .finally(() => {
            setWelcomeScreenVisible(true)
            welcomeScreenAnimationControl.start({
                opacity: 1
            })
        })
    }

    async function showMainMenu() {
        if (currentScreen == 'mainmenu') return
        setCurrentScreen('mainmenu')

        welcomeScreenAnimationControl.start({
            opacity: 0
        }).then(() => {
            setWelcomeScreenVisible(false)
        })
        .finally(() => {
            setMainMenuVisible(true)
            setInTransition(true)
            router.push('/game/menu', '/game')
        })
    }

    useEffect(() => {

        document.addEventListener('keydown', (event) => {
            if (event.repeat) return

            if (event.key == 'Enter') {
                showMainMenu()
                return
            }
            if (event.key == 'Escape') {
                hideMainMenu()
                return
            }
        })
    }, [])

    function calculateFps() {
        var lastLoop:any = new Date();
        let currentFps = '0'
        function gameLoop() { 
            var thisLoop:any = new Date();
            var fps = (1000 / (thisLoop - lastLoop)).toFixed(0);

            lastLoop = thisLoop;
            currentFps = (fps)

            requestAnimationFrame(() => {
                gameLoop()
            })
        }
        gameLoop()

        setInterval(() => {
            setCurrentFinalFps(currentFps)
        }, 500)
    }

    function setWelcomeScreen() {
        setWelcomeSplashVisible(false)
        setWelcomeScreenVisible(true)

        welcomeScreenAnimationControl.start({
                opacity: 1
        })

        function loopButton() {

            welcomeScreenButtonAnimationControl.start({
                scale: 1.2
            }).then(() => {
                welcomeScreenButtonAnimationControl.set({
                    scale: 1
                })
                sideBeatIndicatorAnimationControl.set({
                    opacity: 1
                })
                sideBeatIndicatorAnimationControl.start({
                    opacity: 0
                })
                loopButton()
            })
    }

        setTimeout(() => {
            loopButton()  
        }, 250);
    }

    function startWelcomeText() {
        setSplashStarted(true)
        setTimeout(() => {
            setWelcomeText('wel')
            setTimeout(() => {
                setWelcomeText('welcome')

                setTimeout(() => {
                    setWelcomeText('welcome to')

                    setTimeout(() => {
                        setWelcomeText('welcome to aprilbeat.')

                        welcomeTextAnimationControl.start({
                            scale: 1
                        }).then(() => {
                            setTimeout(() => {
                                welcomeSplashAnimationControl.start({
                                    opacity: 0
                                }).then(() => {
                                    setWelcomeScreen()
                                })
                            }, 1300)
                        })
                    }, 270)
                }, 100)
            }, 200)
        }, 300);
    }
    async function loadAudios() {
        return new Promise(async (resolve, reject) => {
            if (audioLoaded) {
                setIsLoaded(true)
                reject(false)
                return
            }
            await lowLag.loadAudio('welcomeMusic', { src: '/assets/introSeasonal.mp3' })
            setAudioLoaded(true)
            resolve(true)
        })
    }
    function startAllAudios() {
        const welcmusic = lowLag.playAudio('welcomeMusic')
        welcmusic!.source!.loop = true
        // lowLag.getAudio('welcomeMusic')?.gainNode.gain.exponentialRampToValueAtTime(0.01, 5)

        window?.addEventListener('blur', () => {
            // lowLag.getAudio('welcomeMusic')!.gainNode.gain.value = 0.3
            lowLag.getAudio('welcomeMusic')?.sm.fadeOut({
                targetValue: 0.5
            })
        })
        window?.addEventListener('focus', () => {
            // lowLag.getAudio('welcomeMusic')!.gainNode.gain.value = 0.7
            lowLag.getAudio('welcomeMusic')?.sm.fadeIn()
        })
    }
    function startWelcomeScreen() {
        startAllAudios()
        startWelcomeText()
    }
    useEffect(() => {
        if (!router.isReady) return
        lowLag.init(window)
        loadAudios().then(() => {
            setIsLoaded(true)
        })
        calculateFps()
    }, [])

    useEffect(() => {
        if (!router.isReady) return
        router.prefetch('/game/menu')
        if (inTransition == true) {
                setWelcomeScreen()
                return
        }
    }, [router.isReady])

    return (
        <div style={{ backgroundRepeat: 'no-repeat', background: 'linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(/assets/background.png)' }} className={`w-full h-full min-h-screen flex bg-black flex-col bg-cover bg-center text-white`}>

            <div className={`w-full ${isLoaded ? 'hidden' : ''} absolute z-10 h-full min-h-screen flex justify-center items-center`}>
                <h1 className={`px-3 py-2 text-white`}>loading aprilbeat...</h1>
            </div>

            <div className={`w-full ${isLoaded == false || ((splashStarted || inTransition) == true) ? 'hidden' : ''} absolute z-10 h-full min-h-screen bg-gray-900 flex justify-center items-center`}>
                <button className={`from-[#ff9482] to-[#7d77ff] bg-gradient-to-br px-5 py-2 text-white shadow-md shadow-gray-600 hover:animate-pulse rounded-full`} onClick={() => startWelcomeScreen()}>Start Game</button>
            </div>

            <motion.div
            initial={{ opacity: 0 }}
            transition={{ ease: 'easeOut', duration: 0.5 }}
            id="sideBeatIndicator_Left"
            animate={sideBeatIndicatorAnimationControl}
            style={{ background: 'linear-gradient(to right, rgba(56, 189, 249, 0.7), rgba(0, 0, 0, 0))' }}
            className={`absolute w-16 flex justify-center items-center h-full min-h-screen`}>
            </motion.div>
            
            <motion.div
            initial={{ opacity: 0 }}
            transition={{ ease: 'easeOut', duration: 0.5 }}
            id="sideBeatIndicator_Right"
            animate={sideBeatIndicatorAnimationControl}
            style={{ background: 'linear-gradient(to left, rgba(56, 189, 249, 0.7), rgba(0, 0, 0, 0))' }}
            className={`absolute w-16 right-0 flex h-full min-h-screen`}>
            </motion.div>

                <motion.div
                id="welcomeSplash"
                animate={welcomeSplashAnimationControl}
                className={`w-full bg-black rounded-lg flex ${welcomeSplashVisible ? '' : 'hidden'} justify-center items-center h-full min-h-screen text-white`}>
                    <motion.div
                    initial={{ scale: 0.8 }}
                    transition={{ ease: 'easeOut', duration: 0.5 }}
                    animate={welcomeTextAnimationControl}
                    >
                        <h1 className={`text-xl font-medium`}>{welcomeText}</h1>
                    </motion.div>
                </motion.div>

            <motion.div
            id="welcomeScreen"
            initial={{ opacity: 0 }}
            transition={{ ease: 'easeOut', duration: 0.25 }}
            animate={welcomeScreenAnimationControl}
            className={`w-full ${welcomeScreenVisible ? '' : 'hidden'} h-full min-h-screen`}>
                <div className={`w-full h-full min-h-screen flex justify-center items-center`}>
                    <motion.button
                    initial={{ scale: 1 }}
                    animate={welcomeScreenButtonAnimationControl}
                    transition={{ ease: 'easeOut', duration: ((60 / 131.8) * 2) }}
                    className={`bg-blue-300 rounded-md firstbounce flex justify-center items-center outline outline-8 outline-blue-600 w-52 h-52 lg:w-64 lg:h-64`}
                    onClick={() => showMainMenu()}
                    onMouseEnter={
                        () => {
                            welcomeScreenButtonAnimationControl.start({
                                scale: 1.2,
                                transition: { type: "spring", stiffness: 200, velocity: 3, damping: 10 }
                            }).then(() => {
                                welcomeScreenButtonAnimationControl.stop()
                            })
                        }
                    }
                    onMouseLeave={
                        () => {
                            welcomeScreenButtonAnimationControl.start({
                                scale: 1,
                                transition: { type: "spring", stiffness: 200, velocity: 3, damping: 10 }
                            })
                        }
                    }
                    >
                        <div className={``}>
                            <h1 className={`text-6xl lg:text-7xl font-semibold -rotate-6 drop-shadow-lg`}>aprilbeat.</h1>
                            <h3 className={`animate-pulse`}>Tap to start.</h3>
                        </div>
                    </motion.button>
                </div>
            </motion.div> 


            <div id="footer" className={`fixed text-sm md:text-[9px] opacity-70 bottom-0 mb-1 md:mb-0 space-x-1 flex pl-2 w-full`}>
                <h1 className={`font-medium`}>aprilbeat</h1>
                {/* <svg className="react-flow__background react-flow__container w-full h-full"><pattern id="pattern-95073" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="var(--gray-200)"></circle></pattern><rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-95073)"></rect></svg> */}
                <h1>2021.913.0</h1>

                <div>
                    <h1>{currentFinalFps}fps</h1>
                </div>
            </div>
        </div>
    )
}