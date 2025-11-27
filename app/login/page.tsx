"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  AuthError,
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth"

import { auth } from "@/lib/firebase"

const getFriendlyError = (code: string) => {
  switch (code) {
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "The email or password you entered is incorrect."
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again."
    case "auth/invalid-email":
      return "That email address looks invalid."
    default:
      return "We couldn't sign you in right now. Please try again."
  }
}

export default function LoginPage() {
  const router = useRouter()
  const [formValues, setFormValues] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  const isDisabled = useMemo(
    () => busy || !formValues.email || !formValues.password,
    [busy, formValues.email, formValues.password],
  )

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/")
      }
    })
    return () => unsubscribe()
  }, [router])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setBusy(true)

    try {
      await setPersistence(auth, browserLocalPersistence)
      await signInWithEmailAndPassword(auth, formValues.email.trim(), formValues.password)
      router.replace("/")
    } catch (authError) {
      const code = (authError as AuthError).code ?? ""
      setError(getFriendlyError(code))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-black flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">Capture the Flag</p>
          <h1 className="text-4xl md:text-5xl font-black leading-tight">Welcome Back</h1>
          <p className="text-base text-muted-foreground mt-3">Log in to continue solving the mystery.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-card text-card-foreground border border-primary/20 rounded-[32px] shadow-2xl p-8"
        >
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formValues.email}
              onChange={(event) => setFormValues((prev) => ({ ...prev, email: event.target.value }))}
              className="w-full rounded-2xl border border-black/10 bg-background/30 px-5 py-4 text-lg focus:outline-none focus:ring-4 focus:ring-[#F6CDA0]/60"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={formValues.password}
              onChange={(event) => setFormValues((prev) => ({ ...prev, password: event.target.value }))}
              className="w-full rounded-2xl border border-black/10 bg-background/30 px-5 py-4 text-lg focus:outline-none focus:ring-4 focus:ring-[#F6CDA0]/60"
              placeholder="********"
              autoComplete="current-password"
            />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={isDisabled}
            className="w-full rounded-full bg-card-foreground text-[#F6CDA0] text-xl font-semibold py-4 shadow-lg shadow-black/10 hover:shadow-2xl hover:-translate-y-0.5 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {busy ? "Checking credentials..." : "Enter the Arena"}
          </button>

          <p className="text-center text-sm text-muted-foreground">
            Need an account?{" "}
            <Link href="/signup" className="font-semibold text-black underline-offset-4 hover:underline">
              Create one now
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
