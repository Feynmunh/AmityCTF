"use client"

import { useState } from "react"

export default function ChallengePage() {
  const [code, setCode] = useState("")

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // TODO: replace with real validation flow when backend is ready
    alert("Submission received! Keep digging for the real flag.")
  }

  return (
    <div className="min-h-screen bg-[#f48120] flex flex-col items-center justify-center px-4 py-8 text-black">
      <div className="w-full max-w-4xl space-y-10">
        <div className="flex justify-between items-center">
          <div className="bg-black text-white rounded-full px-6 py-4">
            <p className="text-3xl font-semibold tracking-wide">
              Flags <span className="text-[#f1d3a8]">05</span>
            </p>
          </div>
          <img src="/images/acc-logo.png" alt="ACC Logo" className="h-16 w-auto" />
        </div>

        <div className="bg-[#f1caa2] rounded-[48px] p-8 text-center">
          <p className="text-4xl md:text-5xl font-semibold tracking-wide">Challenge 1</p>
        </div>

        <div className="bg-[#f1caa2] rounded-[48px] p-8 h-64">
          <p className="text-xl md:text-2xl font-medium text-center opacity-70">
            Your mission briefing appears here. Decode the clues, extract the signal, and be ready to submit the
            correct flag using the input below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-[#f1caa2] rounded-full px-8 py-5 border border-black/40">
            <label htmlFor="flag-code" className="sr-only">
              Input Code
            </label>
            <input
              id="flag-code"
              type="text"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="Input Code"
              className="w-full bg-transparent focus:outline-none text-xl font-medium placeholder-black/70"
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-black text-white text-2xl font-semibold rounded-full px-16 py-5 hover:translate-y-0.5 transition-transform"
            >
              Enter
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
