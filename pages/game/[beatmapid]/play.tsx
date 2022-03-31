import Head from "next/head";
import Script from 'next/script'
import { useEffect } from "react";
import * as lowLag from "@/clients/lowLag"

declare global {
  interface Window {
    lowLag?: any;
  }
}

export default function Play() {

    useEffect(() => {
        const lowLagScript = document.getElementById('lowLagScript')
        lowLagScript!.onload = () => {
            lowLag.init(window)
            lowLag.loadAudio('nana_geoxor', { src: `/geoxorNana.mp3` })

            setTimeout(() => {
                lowLag.playAudio('nana_geoxor', {})
            }, 2000)
        }
    }, [])

    return (
        <>
                <Script src="/libs/lowLag.js"></Script>
                <Script id="lowLagScript" src="/libs/soundmanager2-jsmin.js"></Script>
            <div className={`w-full h-full min-h-screen`}>
                <audio src={`/geoxorNana.mp3`} autoPlay={false}></audio>
                <div className={`bg-[#D069A3] w-full h-full min-h-screen`}>

                </div>
            </div>
        </>
    )
}