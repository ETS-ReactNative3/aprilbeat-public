import { motion } from 'framer-motion'
import { GameController, BagHandle } from 'react-ionicons'

export default function CanvasIndex() {
    return (
        <motion.div
            className={`bg-[#F0F2F3] dark:bg-[#202020] w-full flex min-h-screen h-full`}
            initial={{ opacity: 1 }}
            transition={{ ease: 'easeInOut', duration: 0.2 }}
            >

                <div className={`h-full w-full flex flex-col px-7`}>

                <div className={`mt-7`}>
                    <h1 className={`font-medium text-gray-600 dark:text-gray-400`}>{`What's hot 🔥`}</h1>
                    <h1 className={`font-semibold text-2xl text-black dark:text-white`}>Browsing Aprilbeat</h1>
                </div>

                    <div id="friendsList" className={`bg-white dark:bg-[#2E2E2E] px-5 py-4 w-full mt-8 rounded-xl shadow-md`}>
                        <h1 className={`font-semibold text-xl text-black dark:text-white`}>Friends</h1>

                        <div id="friends" className={`grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-x-2 gap-y-3 items-top w-full space-x-3 mt-5`}>
                            <button id="friend1" className={`h-full hover:bg-gray-100 transition-all dark:hover:bg-[#202020] text-center px-4 py-3 rounded-xl flex flex-col items-center`}>
                                <img className={`w-16 h-16 rounded-full outline outline-2 outline-blue-500 outline-offset-2`} src={`/assets/mikosunePfp.webp`} />
                                <h1 className={`mt-3 text-sm font-semibold text-black dark:text-white`}>Farrell</h1>
                                <h3 className={`text-gray-400 text-xs`}>Seen 3h ago</h3>
                            </button>

                            <button id="friend2" className={`h-full hover:bg-gray-100 transition-all dark:hover:bg-[#202020] text-center px-4 py-3 rounded-xl flex flex-col items-center justify-top`}>
                                <img className={`w-16 h-16 rounded-full outline outline-2 outline-blue-500 outline-offset-2`} src={`/assets/mikosunePfp.webp`} />
                                <h1 className={`mt-3 text-sm font-semibold text-black dark:text-white`}>Agnetha</h1>
                                <h3 className={`text-green-400 text-xs`}>Online</h3>
                            </button>

                            <button id="friend3" className={`h-full hover:bg-gray-100 transition-all dark:hover:bg-[#202020] text-center px-4 py-3 rounded-xl flex flex-col items-center`}>
                                <img className={`w-16 h-16 rounded-full outline outline-2 outline-blue-500 outline-offset-2`} src={`/assets/mikosunePfp.webp`} />
                                <h1 className={`mt-3 text-sm font-semibold text-black dark:text-white`}>Evelyn</h1>
                                <h3 className={`text-yellow-400 text-xs`}>Busy</h3>
                            </button>

                            <button id="friend4" className={`h-full hover:bg-gray-100 transition-all dark:hover:bg-[#202020] text-center px-4 py-3 rounded-xl flex flex-col items-center`}>
                                <img className={`w-16 h-16 rounded-full outline outline-2 outline-blue-500 outline-offset-2`} src={`/assets/mikosunePfp.webp`} />
                                <h1 className={`mt-3 text-sm font-semibold text-black dark:text-white`}>Beverly</h1>
                                <h3 className={`text-red-400 text-xs`}>Do not disturb</h3>
                            </button>

                        <div className={`ml-auto h-full flex items-center space-x-2`}>

                            <button id="friend5" className={`h-full hover:bg-gray-100 transition-all dark:hover:bg-[#202020] text-center px-4 py-3 rounded-xl flex flex-col items-center`}>
                                <img className={`max-h-16 rounded-full outline outline-2 outline-blue-500 outline-offset-2`} src={`/assets/mikosunePfp.webp`} />
                                <h1 className={`mt-3 text-sm font-semibold text-black dark:text-white`}>Jaden</h1>
                                <h3 className={`text-xs text-gray-400`}>@baldjaden</h3>
                                <h3 className={`text-blue-500 text-xs w-24 mt-2`}>Playing Watashi no Tenshi</h3>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}