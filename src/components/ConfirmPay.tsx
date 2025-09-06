"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Info } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

const ConfirmPay = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Placeholder values (will hook up later)
  const pixKey = searchParams.get("pixKey") || "Key Pix here"
  const amount = searchParams.get("amount")
    ? `R$ ${searchParams.get("amount")}`
    : "Amount here"

  return (
    <div className="min-h-screen bg-stellar-gray flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-card rounded-2xl shadow-lg border border-border p-8 space-y-8">
          {/* Header */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/")}
              className="p-2 h-auto"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Button>
            <h1 className="text-xl font-semibold text-foreground">Confirm Pay</h1>
          </div>

          {/* Recipient Info */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Recipient
              </h2>
              <p className="text-foreground font-medium">{pixKey}</p>
              <p className="text-muted-foreground text-sm">
                Transfer on: {new Date().toLocaleDateString()}
              </p>
            </div>

            {/* Amount */}
            <div className="text-center py-6">
              <p className="text-4xl font-bold text-foreground">{amount}</p>
            </div>

            {/* Info Box */}
            <div className="flex items-start space-x-2 p-4 bg-stellar-black/10 rounded-lg">
              <Info className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                Transfers made with CriptoPix are instant and the fee is already
                included.
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="space-y-4">
            <Button
              variant="stellar"
              size="lg"
              className="w-full h-14 rounded-xl text-base font-medium"
            >
              Transfer Money
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmPay
