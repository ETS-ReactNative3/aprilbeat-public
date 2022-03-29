import Topbar from "@/components/Topbar";
import { AppDataProps } from "@/constants/customTypings/app";
import { motion, useAnimation } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Menu({ dataProps }) {
    const topBarAnimationControl = useAnimation();
    const mainMenuAnimationControl = useAnimation();
    const { state: inTransition, stateSetter: setInTransition } =
        dataProps.inTransition;
    const { state: user } = dataProps.user;
    const router = useRouter();

    useEffect(() => {
        topBarAnimationControl.start({
            translateY: 0,
        });
        mainMenuAnimationControl.start({
            opacity: 1,
        });
    }, []);

    useEffect(() => {
        if (inTransition == false) {
            window.location.href = "/game";
            return;
        }

        document.addEventListener("keydown", (event) => {
            if (event.repeat) return;

            if (event.key == "Escape") {
                setInTransition(true);
                router.push("/game");
                return;
            }
        });
    }, []);

    return (
        <div className={`bg-[#F0F2F3] dark:bg-[#202020] pb-12`}>
            <Topbar animationControl={topBarAnimationControl} userData={user} />

            <motion.div
                className={`w-full flex min-h-screen h-full`}
                animate={mainMenuAnimationControl}
                initial={{ opacity: 0 }}
                transition={{ ease: "easeInOut", duration: 0.2 }}
            >
                <div className={`h-full w-full flex flex-col px-7 pt-[40px]`}>
                    <div className={`mt-7`}>
                        <h1
                            className={`font-medium text-gray-600 dark:text-gray-400`}
                        >{`What's hot 🔥`}</h1>
                        <h1 className={`font-semibold text-2xl text-black dark:text-white`}>
                            Browsing Aprilbeat
                        </h1>
                    </div>

                    <div
                        id="friendsList"
                        className={`bg-white dark:bg-[#2E2E2E] px-5 py-4 w-full mt-8 rounded-xl shadow-md`}
                    >
                        <h1 className={`font-semibold text-xl text-black dark:text-white`}>
                            Friends
                        </h1>

                        <div
                            id="friends"
                            className={`grid grid-flow-row-dense grid-rows-1 grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-x-2 gap-y-3 items-top w-full space-x-3 mt-5`}
                        >
                            <button
                                id="friend1"
                                className={`h-full hover:bg-gray-100 transition-all dark:hover:bg-[#202020] text-center px-4 py-3 rounded-xl flex flex-col items-center`}
                            >
                                <img
                                    className={`w-16 h-16 rounded-full`}
                                    src={`/assets/mikosunePfp.webp`}
                                />
                                <h1
                                    className={`mt-3 text-sm font-semibold text-black dark:text-white`}
                                >
                                    lav
                                </h1>
                                <h3 className={`text-gray-400 text-xs`}>Seen 3h ago</h3>
                            </button>

                            <button
                                id="friend2"
                                className={`h-full hover:bg-gray-100 transition-all dark:hover:bg-[#202020] text-center px-4 py-3 rounded-xl flex flex-col items-center justify-top`}
                            >
                                <img
                                    className={`w-16 h-16 rounded-full `}
                                    src={`/assets/mikosunePfp.webp`}
                                />
                                <h1
                                    className={`mt-3 text-sm font-semibold text-black dark:text-white`}
                                >
                                    Lilith
                                </h1>
                                <h3 className={`text-green-400 text-xs`}>Online</h3>
                            </button>

                            <button
                                id="friend3"
                                className={`h-full hover:bg-gray-100 transition-all dark:hover:bg-[#202020] text-center px-4 py-3 rounded-xl flex flex-col items-center`}
                            >
                                <img
                                    className={`w-16 h-16 rounded-full `}
                                    src={`/assets/mikosunePfp.webp`}
                                />
                                <h1
                                    className={`mt-3 text-sm font-semibold text-black dark:text-white`}
                                >
                                    Abel
                                </h1>
                                <h3 className={`text-yellow-400 text-xs`}>Busy</h3>
                            </button>

                            <button
                                id="friend4"
                                className={`h-full hover:bg-gray-100 transition-all dark:hover:bg-[#202020] text-center px-4 py-3 rounded-xl flex flex-col items-center`}
                            >
                                <img
                                    className={`w-16 h-16 rounded-full `}
                                    src={`/assets/mikosunePfp.webp`}
                                />
                                <h1
                                    className={`mt-3 text-sm font-semibold text-black dark:text-white`}
                                >
                                    Jude
                                </h1>
                                <h3 className={`text-red-400 text-xs`}>Do not disturb</h3>
                            </button>

                            <button
                                id="friend5"
                                className={`h-full hover:bg-gray-100 transition-all dark:hover:bg-[#202020] text-center px-4 py-3 rounded-xl flex flex-col items-center`}
                            >
                                <img
                                    className={`max-h-16 rounded-full `}
                                    src={`/assets/mikosunePfp.webp`}
                                />
                                <h1
                                    className={`mt-3 text-sm font-semibold text-black dark:text-white`}
                                >
                                    Jaden
                                </h1>
                                <h3 className={`text-xs text-gray-400`}>@baldjaden</h3>
                                <h3 className={`text-blue-500 text-xs w-24 mt-2`}>
                                    Playing Watashi no Tenshi
                                </h3>
                            </button>
                        </div>
                    </div>

                    <div
                        id="gamesList"
                        className={`bg-white dark:bg-[#2E2E2E] px-5 py-4 w-full mt-8 pb-10 rounded-xl shadow-md`}
                    >
                        <h1 className={`font-semibold text-xl text-black dark:text-white`}>
                            Games
                        </h1>

                        <div
                            id="games"
                            className={`grid grid-flow-row-dense grid-rows-1 grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-x-2 gap-y-3 items-top w-full space-x-3 mt-20`}
                        >
                            <div
                                id="game1_beatsu"
                                className={`h-72 w-52 flex flex-col text-white rounded-xl shadow-xl bg-gradient-to-br  from-[#513EFC] via-[#D501FB] to-[#F74C35]`}
                            >
                                <img
                                    className={`h-80 absolute opacity-70 -mt-12 ml-7 object-contain`}
                                    src="/assets/hutao.png"
                                />
                                <div
                                    style={{
                                        background:
                                            "linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.6))",
                                    }}
                                    className={`relative mt-auto z-30 pt-3 px-3 rounded-b-xl`}
                                >
                                    <div className={`mb-5 ml-1`}>
                                        <h1 className={`font-semibold`}>Beatsu</h1>
                                        <h3
                                            className={`mt-1 text-sm font-light`}
                                        >{`beatsu is a gamemode primarily developed and created by lavenderlav "lav". Inspired by osu!mania`}</h3>

                                        <div className={`flex w-full justify-center`}>
                                            <button
                                                className={`bg-white hover:bg-[#6466F1] transition-all text-black hover:text-white w-full px-2 py-2 mt-4 rounded-xl font-medium text-sm`}
                                            >
                                                Play Beatsu
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
