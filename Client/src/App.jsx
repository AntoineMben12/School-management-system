import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './App.css'

function App() {
  const boxRef = useRef(null)
  const titleRef = useRef(null)

  useEffect(() => {
    gsap.fromTo(titleRef.current,
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    )

    gsap.to(boxRef.current, {
      rotation: 360,
      duration: 2,
      repeat: -1,
      ease: 'none'
    })
  }, [])

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4">
      <h1 ref={titleRef} className="text-5xl font-bold mb-8 text-blue-400">
        React + Tailwind + GSAP
      </h1>

      <div
        ref={boxRef}
        className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl flex items-center justify-center text-2xl font-bold"
      >
        Vite
      </div>

      <p className="mt-8 text-slate-400 text-lg">
        Tailwind CSS v4 and GSAP are successfully installed!
      </p>

      <div className="mt-12 flex gap-4">
        <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors font-medium">
          Get Started
        </button>
        <button className="px-6 py-2 border border-slate-700 hover:bg-slate-800 rounded-full transition-colors font-medium">
          Documentation
        </button>
      </div>
    </div>
  )
}

export default App
