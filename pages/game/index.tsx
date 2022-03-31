import { useEffect, useState } from "react"
import { motion, useAnimation } from 'framer-motion'
import { AppDataProps } from "@/constants/customTypings/app";
import * as lowLag from '@/clients/lowLag'
import { useRouter } from "next/router"
import * as apifetch from "@/clients/apiPublic";
import { Songs } from '@prisma/client'
import BottomBar from "@/components/bottomBar";

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
    const [startSequenceRan, setStartSequenceRan] = useState(false)
    const [remainingAudiosLoaded, setRemainingAudiosLoaded] = useState(false)
    const [welcomeText, setWelcomeText] = useState('')
    const [welcomeSplashVisible, setWelcomeSplashVisible] = useState(true)
    const [welcomeScreenVisible, setWelcomeScreenVisible] = useState(false)
    const [splashStarted, setSplashStarted] = useState(false)
    const [mainMenuVisible, setMainMenuVisible] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)
    const [currentFinalFps, setCurrentFinalFps] = useState('0')
    const [currentBackgroundSong, setCurrentBackgroundSong] = useState<Songs>()
    const { state: inTransition, stateSetter: setInTransition } =
        dataProps.inTransition;
    const { state: audioLoaded, stateSetter: setAudioLoaded } = dataProps.audioLoaded
    const { state: user, stateSetter: setUser } =
        dataProps.user;
    const { state: userData, stateSetter: setUserData } =
        dataProps.userData;

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

        dataProps.pageTransitionAnimationControl.mount()
        .then(() => {
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
    async function loadNeededAudios() {
        return new Promise(async (resolve, reject) => {
            if (audioLoaded) {
                reject(false)
                return
            }
            await lowLag.loadAudio('welcomeMusic', { src: '/assets/introDump.mp3' })
            resolve(true)
        })
    }
    async function loadRemainingAudios() {
        return new Promise((resolve, reject) => {

            async function fetchAndLoadAudio(songid) {
                return new Promise(async (res, rej) => {
                    const songData = await apifetch.fetchAudioLink(songid)
                    await lowLag.loadAudio(songid, { src: songData.signedURL })
                    res(true)
                })
            }

            let passedfirst = false
            if (!userData && !user) {
                resolve(true)
            }
            userData?.songs.forEach(async (songid) => {

                if (!passedfirst) {
                    await fetchAndLoadAudio(songid).then(() => {
                        setAudioLoaded(true)
                        resolve(true)
                    })
                    passedfirst = true
                    return
                }
                fetchAndLoadAudio(songid)
            })
        })
    }
    useEffect(() => {
        if (!userData || !user || remainingAudiosLoaded) return
        loadRemainingAudios()
        setRemainingAudiosLoaded(true)
    }, [userData, user])
    
    async function startAllAudios() {
        let currentindex = 0
        const welcmusic = lowLag.playAudio('welcomeMusic', {})

        function relayNextAudio(audio) {
            audio?.source.addEventListener('ended', async () => {
                if (currentindex + 1 > userData?.songs.length) {
                    currentindex = 0
                }
                const songid = userData?.songs[currentindex]
                if (!songid) return
                const songData = await apifetch.fetchAudioLink(songid)
                // await lowLag.loadAudio(songid, { src: songData.signedURL })
                const newaudio = lowLag.playAudio(songid, {})
                setCurrentBackgroundSong(songData.songData)
                relayNextAudio(newaudio)
                currentindex++
            })
        }
        relayNextAudio(welcmusic)

        window.addEventListener('keydown', (event) => {
            if (event.code == 'Minus') {
                console.log(lowLag.getGlobalVolume())
                lowLag?.setGlobalVolume(lowLag.getGlobalVolume() - 0.1, {})
            }
            if (event.code == 'Equal') {
                lowLag?.setGlobalVolume(lowLag.getGlobalVolume() + 0.1, {})
            }
        })

        window?.addEventListener('blur', () => {
            lowLag.setGlobalVolume(lowLag.getGlobalVolume() - 0.2, {})
        })
        window?.addEventListener('focus', () => {
            lowLag.setGlobalVolume(lowLag.getGlobalVolume() + 0.2, {})
        })
    }
    function startWelcomeScreen() {
        startAllAudios()
        startWelcomeText()
    }
    

    useEffect(() => {
        if (!router.isReady || startSequenceRan) return

        // Router Prefetches
        router.prefetch('/game/menu')
        router.prefetch('/auth')

        setStartSequenceRan(true)
        if (inTransition == true) {
                setIsLoaded(true)
                setWelcomeScreen()
                return
        }

        lowLag.init(window)
        loadNeededAudios().then(() => {
            setIsLoaded(true)
        })
    }, [router.isReady, userData, user])

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
                        transition={{ ease: 'easeOut', duration: ((60 / Number(currentBackgroundSong?.bpm) || 126) * 2) }}
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

            <BottomBar />
        </div>
    )
}