import { useEffect, useState } from "react"


export default function BottomBar() {

    const [currentFinalFps, setCurrentFinalFps] = useState('0')

    function calculateFps() {
        var lastLoop: any = new Date();
        let currentFps = '0'
        function gameLoop() {
            var thisLoop: any = new Date();
            var fps = (1000 / (thisLoop - lastLoop)).toFixed(0);

            lastLoop = thisLoop;
            currentFps = (fps)

            requestAnimationFrame(() => {
                gameLoop()
            })
        }
        gameLoop()

        setInterval(() => {
            setCurrentFinalFps(currentFps)
        }, 350)
    }

    useEffect(() => {
      calculateFps()
    }, [])
    

    return (
        <div id="footer" className={`fixed text-sm md:text-[9px] opacity-70 bottom-0 mb-1 md:mb-0 space-x-1 flex pl-2 w-full`}>
            <h1 className={`font-medium`}>aprilbeat</h1>
            {/* <svg className="react-flow__background react-flow__container w-full h-full"><pattern id="pattern-95073" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="var(--gray-200)"></circle></pattern><rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-95073)"></rect></svg> */}
            <h1>2021.913.0</h1>

            <div>
                <h1>{currentFinalFps}fps</h1>
            </div>
        </div>
    )
}