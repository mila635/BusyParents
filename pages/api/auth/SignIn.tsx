// import { signIn, useSession } from "next-auth/react"
// import { useEffect, useState } from "react"

// export default function SignIn() {
//   const { data: session, status } = useSession()
//   const [isLoading, setIsLoading] = useState(false)

//   // ✅ Trigger webhook with flat JSON
//   const triggerWebhook = async () => {
//     if (!session) return
//     try {
//       const response = await fetch(
//         process.env.NEXT_PUBLIC_MAKE_USER_SIGNUP_WEBHOOK_URL!,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             email: session.user?.email,
//             name: session.user?.name,
//             accessToken: (session as any)?.accessToken,
//           }),
//         }
//       )

//       if (!response.ok) {
//         console.error("❌ Webhook failed:", response.status, await response.text())
//       } else {
//         console.log("✅ Webhook sent successfully")
//       }
//     } catch (error) {
//       console.error("❌ Failed to trigger webhook:", error)
//     }
//   }

//   // ✅ Handle session state
//   useEffect(() => {
//     if (status === "authenticated") {
//       setIsLoading(false)
//       triggerWebhook()
//       // No need for router.push, callbackUrl handles redirect
//     } else if (status === "unauthenticated") {
//       setIsLoading(false)
//     }
//   }, [status, session])

//   return (
//     <div className="flex items-center justify-center h-screen">
//       <button
//         onClick={() => {
//           setIsLoading(true)
//           signIn("google", { callbackUrl: "/dashboard" })
//         }}
//         disabled={isLoading}
//         className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition"
//       >
//         {isLoading ? "Loading..." : "Sign in with Google"}
//       </button>
//     </div>
//   )
// }





import { signIn, useSession } from "next-auth/react"
import { useEffect, useState } from "react"

export default function SignIn() {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(false)

  const triggerWebhook = async () => {
    if (!session) return
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_MAKE_USER_SIGNUP_WEBHOOK_URL!,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: session.user?.email,
            name: session.user?.name,
            accessToken: (session as any)?.accessToken,
          }),
        }
      )
      if (!response.ok) {
        console.error("❌ Webhook failed:", response.status, await response.text())
      } else {
        console.log("✅ Webhook sent successfully")
      }
    } catch (error) {
      console.error("❌ Failed to trigger webhook:", error)
    }
  }

  useEffect(() => {
    if (status === "authenticated") {
      setIsLoading(false)
      triggerWebhook()
    } else if (status === "unauthenticated") {
      setIsLoading(false)
    }
  }, [status, session])

  return (
    <div className="flex items-center justify-center h-screen">
      <button
        onClick={() => {
          setIsLoading(true)
          signIn("google", { callbackUrl: "/dashboard" })
        }}
        disabled={isLoading}
        className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition"
      >
        {isLoading ? "Loading..." : "Sign in with Google"}
      </button>
    </div>
  )
}

