import { useEffect, useState } from "react"
import { motion } from 'framer-motion'


export default function BottomBar(
    { title = 'Hello world!', description = 'Aprilbeat all and forever.', animation }:
    { title: string | null, description: string, animation: any }
    ) {

    return (
        <motion.button
        initial={{ opacity: 0 }}
        animate={animation}
        className={`absolute text-right text-white w-[500px] right-0 md:mr-4 mr-5 mt-5 md:mt-3`}
        >
            {/* <h3 className={`font-semibold`}>Nocturnal</h3>
            <h3 className={`font-light text-sm`}>by SVRGE</h3> */}

            {/* <h3 className={`font-semibold`}>Update available</h3>
            <h3 className={`font-light text-sm`}>applying update on next start - v2022.331.1</h3> */}

            <h3 className={`font-semibold`}>{title}</h3>
            <h3 className={`font-light text-sm`}>{description}</h3>
        </motion.button>
    )
}