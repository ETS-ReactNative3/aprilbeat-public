import Head from "next/head";
import Script from 'next/script'
import { useEffect, useState } from "react";
import * as lowLag from "@/clients/lowLag"
import * as api from "@/clients/apiPublic"
import { Beatmaps } from "@prisma/client"
import { useRouter } from "next/router";

export default function Play({ dataProps }) {

    const router = useRouter()
    const [gameReady, setGameReady] = useState<boolean>(false)
    const [beatmapData, setBeatmapData] = useState<Beatmaps>()

    useEffect(() => {
        (async () => {
            console.log('abcddd')

            // Initialize the game
            lowLag.init(window)

            // Fetch beatmap and save to state
            const { beatmapid } = router.query
            const beatmap = await api.fetchBeatmap(beatmapid)
            const beatmapsong = await api.fetchAudioLink(beatmap.songid)
                setBeatmapData(beatmap)
                // Load Audio to lowLag
                await lowLag.loadAudio(`audio_${beatmap.beatmapid}`, { src: beatmapsong.signedURL })
                lowLag.playAudio(`audio_${beatmap.beatmapid}`, {})


            // Mark game as ready (must be the end after all fetches.)
            setGameReady(true)
        })()
    }, [])

    return (
        <div className={`w-full h-full min-h-screen`}>
            <div className={`bg-[#D069A3] w-full h-full min-h-screen`}>

            </div>
        </div>
    )
}