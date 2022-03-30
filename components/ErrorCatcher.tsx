
export default function ErrorBoundaryComp({ didCatch, error, area }) {
    return (
        <div className={`${didCatch ? '' : 'hidden'} h-screen w-screen px-10 py-5 text-center flex flex-col justify-center items-center`}>
          <h1 className={`text-xl font-medium`}>An error has been caught and studicade stopped to prevent any confliction</h1>
          <h3 className={``}>No worries, this error has been caught and reported to devs at the studicade team.</h3>
          <h3 className={`text-sm mt-2`}>error: {error?.stack || 'Unknown error'}</h3>
        </div>
    )
}