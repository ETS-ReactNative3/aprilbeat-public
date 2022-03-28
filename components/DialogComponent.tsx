import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'

interface DialogComponent {
  title?: string;
  description?: string;
  state: any;
  stateSetter: Function;
  buttonDisabled?: boolean;
  dismissable?: boolean;
  buttonText?: string;
  callback?: any;
  raw?: boolean;
  children?: any;
}

export default function DialogComp({ title, description, state, stateSetter, buttonDisabled = false, dismissable = true, buttonText = 'Got It, thanks!', callback = () => null, raw = false, children }:DialogComponent) {

    const dialogIsOpen = state
    const setDialogIsOpen = stateSetter

    function dismissDialog() {
      console.log('dismiss')
      if (!dismissable) return
      
        if (callback) {
          callback()
          setDialogIsOpen(false)
          return
        }

        setDialogIsOpen(false)
    }

    return (

  <Transition appear show={dialogIsOpen} as={Fragment}>
        <div className="w-screen h-screen hidden">
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => dismissDialog()}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-800 opacity-20 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">

                <div id="contentDialog" className={`${raw ? 'hidden' : ''}`}>
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  {title}
                </Dialog.Title>
                <div className="mt-1">
                  <p className="text-sm text-gray-500">
                    {description}
                  </p>
                </div>

                {children}

                <div className={`mt-3 ${dismissable ? '' : 'hidden'}`}>
                  <button
                    type="button"
                    disabled={buttonDisabled ? true : false}
                    className="inline-flex shadow-md justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={() => dismissDialog()}
                  >
                    {buttonText}
                  </button>
                </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
        </div>
      </Transition>
    )
}