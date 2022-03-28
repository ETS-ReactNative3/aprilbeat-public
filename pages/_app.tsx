/* eslint-disable @next/next/no-sync-scripts */
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { motion, useAnimation } from 'framer-motion'
import { useState } from 'react'

function MyApp({ Component, pageProps }: AppProps) {

  const pageTransitionAnimationControl = useAnimation()
  const [inTransition, setInTransition] = useState(false)
  const [audioLoaded, setAudioLoaded] = useState(false)

  const dataProps = {
    pageTransitionAnimationControl: {
      mount: async() => {
        return new Promise((resolve, reject) => {
          pageTransitionAnimationControl.start({
            translateX: '0px'
          })
          .finally(() => {
              resolve(true)
          })
        })
      },
      unmount: async() => {
        return new Promise((resolve, reject) => {
            pageTransitionAnimationControl.start({
              translateX: '100vw'
            }).then(() => {
              pageTransitionAnimationControl.set({
                translateX: '-100vw'
              })
          })
          .finally(() => {
            resolve(true)
          })
        })
      },
    },

    inTransition: [inTransition, setInTransition],
    audioLoaded: [audioLoaded, setAudioLoaded]
  }

  return (
    <div>
      <div>
        <script src="/libs/lowLag.js" />
        <script src="/libs/soundmanager2-jsmin.js" />
        <noscript>Please enable Javascript to continue.</noscript>
      </div>

      <div>
        <motion.div
            initial={{ translateX: '-100vw' }}
            transition={{ ease: 'easeOut', duration: 0.2 }}
            animate={pageTransitionAnimationControl}
            className={`absolute w-full z-10 h-screen bg-gray-800`}
        />
        <Component {...pageProps} dataProps={dataProps} />
      </div>
    </div>
  )
}

export default MyApp
