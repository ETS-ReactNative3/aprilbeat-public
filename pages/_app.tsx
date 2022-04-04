/* eslint-disable @next/next/no-sync-scripts */
import '../styles/globals.css'
import { motion, useAnimation } from 'framer-motion'
import { useEffect, useState, StrictMode } from 'react'
import { supabase } from '@/clients/supabasePublic'
import Head from 'next/head'
import { AppDataProps } from '@/constants/customTypings/app'
import type { AuthSession, AuthUser } from '@supabase/supabase-js'
import type { Users } from '@prisma/client'
import * as api from '@/clients/apiPublic'
import useErrorBoundary from "use-error-boundary"
import ErrorCatcher from '@/components/ErrorCatcher'

function MyApp({ Component, pageProps }) {

  // Initialize app error boundary
  const {
    ErrorBoundary,
    didCatch,
    error,
    reset
  } = useErrorBoundary()

  // Install service worker
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", function () {
        navigator.serviceWorker.register("/sw.js").then(
          function (registration) {
            console.log("Service Worker registration successful with scope: ", registration.scope);
          },
          function (err) {
            console.log("Service Worker registration failed: ", err);
          }
        );
      });
    }
  }, [])

  // States and Animation Controls
  const pageTransitionAnimationControl = useAnimation()
  const [inTransition, setInTransition] = useState(false)
  const [audioLoaded, setAudioLoaded] = useState(false)
  const [session, setSession] = useState<AuthSession>()
  const [user, setUser] = useState <AuthUser>()
  const [userData, setUserData] = useState<Users>()

  // Dataprops to be passed to page component
  const dataProps: AppDataProps = {
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

    inTransition: { state: inTransition, stateSetter: setInTransition },
    audioLoaded: { state: audioLoaded, stateSetter: setAudioLoaded },
    user: { state: user, stateSetter: setUser },
    userData: { state: userData, stateSetter: setUserData }
  }

  useEffect(() => {

    // Supabase User
    const user = supabase.auth.user()
    const session = supabase.auth.session()
    keepUser(user, session)
    
  
    supabase.auth.onAuthStateChange((event, session) => {
      keepUser(session?.user, session)
    })

    function keepUser(user, session) {
      if (user) {
        setUser(user)
      } else {
        setUser(undefined)
      }
    }


    // Database User
    api.userData()
      .then((userdt) => {
        console.log(userdt)
        setUserData(userdt)
      })
  }, [])
  

  return (
    <div>
      <ErrorCatcher
        didCatch={didCatch}
        error={error}
        area={`app_document`}
      />
      <ErrorBoundary>
        <Head>
          <title>Aprilbeat</title>

          <meta name="viewport" content="user-scalable=no, width=device-width, height=device-height" />
          <meta name="mobile-web-app-capable" content="yes" />

          <meta name="title" content="Aprilbeat" />
          <meta name="description" content="rythm game shouldn't be limited. Now publicly available, running fully on web." />
        </Head>
        <div>
          <script src="/libs/lowLag.js" />
          <script src="/libs/soundmanager2-jsmin.js" />
          <noscript>Please enable Javascript to continue.</noscript>
        </div>

        <StrictMode>
          <div>
            <motion.div
                initial={{ translateX: '-100vw' }}
                transition={{ ease: 'easeOut', duration: 0.2 }}
                animate={pageTransitionAnimationControl}
                className={`absolute overflow-hidden w-full z-50 h-screen bg-gray-800`}
            />
            <Component {...pageProps} dataProps={dataProps} />
          </div>
        </StrictMode>
      </ErrorBoundary>
    </div>
  )
}

export default MyApp
