import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function BeatmapSelect({ dataProps }: {dataProps:AppDataProps}) {

    const router = useRouter()

    useEffect(() => {
        dataProps.pageTransitionAnimationControl.unmount()
    }, [])

    return (
        <div className={`bg-gray-800 w-full h-full min-h-screen`}>
            
        </div>
    )
}