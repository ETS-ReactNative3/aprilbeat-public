import Head from "next/head";
import { motion, useAnimation } from 'framer-motion'
import { useEffect, useState } from "react";
import * as lowLag from "@/clients/lowLag"
import * as api from "@/clients/apiPublic"
import { Beatmaps } from "@prisma/client"
import { useRouter } from "next/router";
import type { Songs } from '@prisma/client'

export default function Play({ dataProps }) {

    const router = useRouter()
    const [gameReady, setGameReady] = useState<boolean>(false)
    const [beatmapData, setBeatmapData] = useState<Beatmaps>()

    // Beatmap Side Datas
    const [beatmapSongData, setBeatmapSongData] = useState<Songs>()
    const [backgroundImageUrl, setBackgroundImageUrl] = useState<string>('')
    const [loadingIsVisible, setLoadingIsVisible] = useState<boolean>(false)
    const [gameBoardVisible, setGameBoardVisible] = useState<boolean>(false)

    // Parsing Datas
    const [gameboardTexts, setGameboardTexts] = useState<Array<object>>([])

    // Animation Controls
    const backgroundAnimationControl = useAnimation()
    const loadingScreenAnimationControl = useAnimation()
    const gameboardGridAnimationControl = useAnimation()
    const animationcontrols = {
        backgroundAnimationControl,
        loadingScreenAnimationControl,
        gameboardGridAnimationControl
    }

    const data = {
        1000: {
            game: {
                clickies: [
                    {
                        lane: 1,
                        multiplier: 1,
                    }
                ]
            },
            motion: {
                gameboardGridAnimationControl: {
                    positionFromBottom: 80
                }
            }
        },
        1900: {
            motion: {
                gameboardGridAnimationControl: {
                    positionFromBottom: 20
                }
            },
        },
        2800: {
            motion: {
                gameboardGridAnimationControl: {
                    positionFromBottom: 100
                }
            },
        },
        3800: {
            motion: {
                gameboardGridAnimationControl: {
                    positionFromBottom: 20
                }
            }
        },
    }
    const motionmappings = {
        positionFromBottom: {
            transform: (thevalue) => {
                const val = `translate(50%, ${-Math.abs(thevalue)}%)`
                return val
            },
        },
        ease: {
            transition: (easetype) => {
                const val = { ease: easetype }
                return val
            }
        }
    }

    useEffect(() => {
        if (!router.isReady) return

        // Functions
        async function prepareGame() {
            return new Promise((resolve, reject) => {

                let totalclickies: object[] = []
                Object.keys(data).forEach((timeouttime) => {
                    const actualdata = data[timeouttime]
                    const { motion, game } = actualdata

                    // Game Parsing
                    if (game) {
                        const clickies = game?.clickies
                        if (!clickies) return
                        clickies.forEach((clickie) => {
                            const { lane, multiplier } = clickie
                            const text = {
                                area: Number(lane),
                                multiplier: Number(multiplier),
                            }
                            totalclickies.push(text)

                            setTimeout(() => {
                                console.log(text)
                            }, Number(timeouttime));
                        })
                    }
                    console.log(totalclickies)

                    // Text parsing
                    // if (text) {
                    //     console.log(text)
                    //     Object.keys(text).forEach((textmodifyaction: any) => {
                    //         const value = text[textmodifyaction]
                            
                    //         // textdata = { text: "I'm not letting you go." }
                    //         console.log(value)
                    //         finaltexts.push(value)
                    //     })
                    // }

                    setTimeout(() => {
                        // Motion parsing
                        if (motion) {
                            Object.keys(motion).forEach((key) => {
                                var motionkeyvalue = key
                                // key = gameboardGridAnimationControl

                                // { positionFromBottom: 80 }
                                const motionelement = motion[key]
                                let motionoptions = {}

                                Object.keys(motionelement).forEach((motionmovings) => {
                                    const thevalue = motionelement[motionmovings]
                                    
                                    if (motionmappings[motionmovings]) {
                                        // { transform: 'translate(50%, {{ .value }}%)' }
                                        const motiondata = motionmappings[motionmovings]
                                        Object.keys(motiondata).forEach((motiondatakey) => {
                                            // 'translate(50%, {{ .value }}%)'
                                            const motiondatavalue = motiondata[motiondatakey]
                                            const finalvalue = motiondatavalue(thevalue)
                                            motionoptions[motiondatakey] = finalvalue
                                        })
                                    }
                                })
                                // Apply motion here
                                animationcontrols[motionkeyvalue].start(motionoptions)
                            })
                        }
                    }, Number(timeouttime));

                })
                // setGameboardTexts(finaltexts)

                resolve(true)
            })
        }

        async function startGame() {
            
        }

        (async () => {
             // Initialize the game
            lowLag.init(window)

            // Fetch beatmap and save to state
            const { beatmapid } = router.query
            const beatmap = await api.fetchBeatmap(beatmapid)
            const beatmapsong = await api.fetchAudioLink(beatmap.songid)
            const beatmapimage = await api.fetchImageLink(beatmap.imageid)
                setBeatmapSongData(beatmapsong.songData)
                setBeatmapData(beatmap)
                setBackgroundImageUrl(beatmapimage.signedURL)

                // Load Background Image
                const bgimage = new Image()
                bgimage.src = beatmapimage.signedURL
                bgimage.onload = () => {
                    console.log('YSES')
                    setLoadingIsVisible(true)
                    backgroundAnimationControl.start({
                        background: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${beatmapimage.signedURL})`
                    })
                }

                // Load Audio to lowLag
                await lowLag.loadAudio(`audio_${beatmap.beatmapid}`, { src: beatmapsong.signedURL })
                // lowLag.playAudio(`audio_${beatmap.beatmapid}`, {})


            // Mark game as ready (must be the end after all fetches.)
            setGameReady(true)

            // Fade out the loading screen after awhile
            setTimeout(() => {
                loadingScreenAnimationControl.start({
                    opacity: 0
                }).then(() => {
                    backgroundAnimationControl.start({
                        filter: 'blur(0px)'
                    }).then(async () => {
                        setGameBoardVisible(true)

                        await prepareGame()

                        // Start the game
                        const mainaudio = lowLag.playAudio(`audio_${beatmap.beatmapid}`, {})
                        startGame()
                    })
                })
            }, 500);
        })()
    }, [router.isReady])

    return (
        <div className={`w-full h-full min-h-screen`}>
            <div className={`absolute ${loadingIsVisible ? 'hidden' : ''} z-20 w-full h-full bg-black text-white`}>
                <h1>Loading</h1>
            </div>
            <motion.div
            id="loadingScreen"
            animate={loadingScreenAnimationControl}
            className={`absolute w-full h-full z-10 text-white flex flex-col justify-center items-center`}>
                <h1 className={`text-xl font-medium`}>{beatmapSongData?.title || 'Let You Go'}</h1>
                <h2 className={`text-md`}>{beatmapSongData?.artist || 'SVRGE'}</h2>
                <img className={`h-14 w-72 object-cover rounded-xl shadow-xl mt-2`} src={`${backgroundImageUrl || ''}`} />
                <h2 className={`mt-2`}>Easy</h2>

                <div className={`text-xs mt-10 space-y-1`}>
                    <div className={`flex space-x-1`}>
                        <h1 className={`text-gray-400`}>Beatmapper:</h1>
                        <h2>lavenderlav</h2>
                    </div>

                    <div className={`flex space-x-1`}>
                        <h1 className={`text-gray-400`}>Source:</h1>
                        <h2>lavenderlav</h2>
                    </div>
                </div>
            </motion.div>

            <motion.div
            initial={{ background: `linear-gradient(rgba(0, 0, 0, 1), rgba(0, 0, 0, 1))`, filter: 'blur(15px)' }}
            transition={{ duration: 0.45 }}
            animate={backgroundAnimationControl}
            className={`bg-cover bg-center w-full h-full top-0 bottom-0 fixed -z-10 scale-110`}
            />

            <div className={`${gameBoardVisible ? '' : 'hidden'} w-full h-full min-h-screen z-50`}>
                <motion.div
                id="gameboard_grid"
                animate={gameboardGridAnimationControl}
                className={`bg-gray-900 w-full h-56 absolute flex`}
                transition={{ ease: 'easeOut' }}
                initial={{ transform: 'translate(50%, -50%)', top: '50%', right: '50%' }}
                >
                    <div className={`w-full h-full`}>
                        <div className={`flex flex-col justify-between bg-[#EEEDEE] outline outline-8 outline-[#CCCCCC] w-full h-full`}>
                            <div id="lane-1" className={`w-full h-full outline outline-1 outline-[#706581]`}>

                            </div>
                            <div id="lane-3" className={`w-full h-full outline outline-1 outline-[#706581]`}>

                            </div>
                            <div id="lane-4" className={`w-full h-full outline outline-1 outline-[#706581]`}>

                            </div>

                            <div className={`bg-[#663C6A] absolute left-24 h-full w-1.5 outline outline-1.5 outline-[#C251B1]`}>

                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div className={`absolute h-full w-full text-white`}>
                    {(() => {
                        return gameboardTexts.map((textdata:any) => {
                            return (
                                <motion.h1
                                key={`gameboard_texts_${textdata.id}`}
                                transition={{ ease: 'easeOut' }}
                                className={`absolute`}
                                initial={{ transform: 'translate(50%, -50%)', top: '50%', right: '50%' }}
                                >
                                    {textdata.text}
                                </motion.h1>
                            )
                        })
                    })()}
                </motion.div>
            </div>

            <div className={`text-xs ml-2 mb-2 text-white fixed bottom-0 left-0`}>
                <h1>{``}</h1>
            </div>
        </div>
    )
}