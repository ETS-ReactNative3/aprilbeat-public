import { useEffect, useState } from 'react'
import { CogOutline, HomeOutline, NotificationsOutline, PeopleOutline } from 'react-ionicons'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import type { AuthUser } from '@supabase/supabase-js'
import useErrorBoundary from "use-error-boundary"
import ErrorCatcher from './ErrorCatcher';
import { supabase } from '@/clients/supabasePublic'

interface Topbar {
    animationControl?: any
    userData: AuthUser | undefined;
    inTransitionSetter: any;
}

export default function TopbarComponent({ animationControl, userData, inTransitionSetter }:Topbar) {

    const [hoveringInButton, setHoveringInButton] = useState(false)
    const router = useRouter()
    let user = userData

    const {
        ErrorBoundary,
        didCatch,
        error,
        reset
    } = useErrorBoundary()
    

    return (
        <div>
            <ErrorCatcher
                didCatch={didCatch}
                error={error}
                area={`component_topbar`}
            />
            <ErrorBoundary>
            <motion.div
            initial={{ translateY: animationControl ? -40 : 0 }}
            animate={animationControl}
            className={`fixed flex flex-col justify-center z-10 w-full`}
            >
                <div
                className={`h-10 bg-[#191919]`}
                onMouseEnter={() => setHoveringInButton(true)}
                onMouseLeave={() => setHoveringInButton(false)}
                >
                    <div
                    id="toolbar"
                    className={`h-full w-full flex items-center`}
                    >
                        <div className={`flex items-center text-white h-full`}>
                        {(() => {
                            const toolbarbuttons = [
                                {
                                    id: 'settings',
                                    prompt: {
                                        name: 'Settings',
                                        description: 'Change the way how aprilbeat works.'
                                    },
                                    icon: {
                                        src: CogOutline,
                                        scale: '26px'
                                    },
                                    customClasses: '',
                                    callback: () => {
                                        return null
                                    }
                                },
                                {
                                    id: 'home',
                                    prompt: {
                                        name: 'Home',
                                        description: 'Lets get you back home. This button will take you back to the home page.'
                                    },
                                    icon: {
                                        src: HomeOutline,
                                        scale: '22px'
                                    },
                                    customClasses: 'ml-3',
                                    callback: () => {
                                        inTransitionSetter(true);
                                        router.push('/game', '/game')
                                        return null
                                    },
                                },
                            ]

                            return toolbarbuttons.map((tbbtn) => {
                                return (
                                    <div onClick={() => tbbtn.callback()} className={`hover:bg-gray-500 ${tbbtn?.customClasses || ''} group transition-all h-full w-fit px-3 flex items-center`} key={`toolbar_btn-${tbbtn.id}`}>
                                        <button>
                                            <tbbtn.icon.src
                                            color={'#ffffff'}
                                            
                                            height={tbbtn.icon.scale}
                                            width={tbbtn.icon.scale}
                                            />
                                        </button>

                                        <div className={`absolute opacity-0 text-white transition-all group-hover:opacity-100 w-64 top-0 font-Torus mt-12 md:mt-11`}>
                                            <h1 className={`font-semibold text-xl md:text-base`}>{tbbtn.prompt.name}</h1>
                                            <h3 className={`text-md md:text-[13px] font-light`}>{tbbtn.prompt.description}</h3>
                                        </div>
                                    </div>
                                )
                            })
                        })()}
                        </div>

                        <div className={`ml-auto h-full flex items-center`}>
                            
                            {(() => {
                                const toolbarRightButtons = [
                                {
                                    id: 'accountdetails',
                                    prompt: {
                                        name: 'Account Details',
                                        description: `Access your account information here.`
                                    },
                                    icon: {
                                        src: PeopleOutline,
                                        scale: '22px',
                                        text: `${user?.id ? user.id : ''}`
                                    },
                                    customClasses: '',
                                    callback: () => {
                                        const user = supabase.auth.user()
                                        if (!user) router.push('/auth', '/game')
                                        else return null
                                    },
                                },
                                {
                                    id: 'notifications',
                                    prompt: {
                                        name: 'Notifications',
                                        description: `Lets see what aprilbeat has to say.`
                                    },
                                    icon: {
                                        src: NotificationsOutline,
                                        scale: '22px',
                                        text: ''
                                    },
                                    customClasses: '',
                                    callback: () => {
                                        return null
                                    },
                                }
                            ]

                            return toolbarRightButtons.map((tbbtn) => {
                                return (
                                    <div onClick={() => tbbtn.callback()} className={`hover:bg-gray-500 ${tbbtn?.customClasses || ''} group transition-all h-full w-fit px-3 flex items-center`} key={`toolbar_btn-${tbbtn.id}`}>
                                        <button className={`flex items-center text-white h-full`}>
                                            <tbbtn.icon.src
                                            color={'#ffffff'}
                                            
                                            height={tbbtn.icon.scale}
                                            width={tbbtn.icon.scale}
                                            />
                                            <h1 className={`${!tbbtn.icon.text || tbbtn.icon.text == '' ? 'hidden' : ''} text-sm ml-2 mt-[2px]`}>{tbbtn.icon.text}</h1>
                                        </button>

                                        <div className={`absolute opacity-0 text-white transition-all group-hover:opacity-100 right-5 top-0 font-Torus mt-12 md:mt-11`}>
                                            <h1 className={`font-semibold text-xl md:text-base`}>{tbbtn.prompt.name}</h1>
                                            <h3 className={`text-md md:text-[13px] font-light`}>{tbbtn.prompt.description}</h3>
                                        </div>
                                    </div>
                                )
                            })
                            })()}
                        </div>
                    </div>
                </div>
                <div className={`transition-all ${hoveringInButton ? `opacity-100` : 'opacity-0'} w-full h-36`} style={{ background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(1, 1, 1, 0))' }} />
            </motion.div>
            </ErrorBoundary>
        </div>
    )
}