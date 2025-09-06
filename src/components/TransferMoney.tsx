"use client"

import React, { useState } from "react"
import { Info, Camera, Copy } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { InputNumeric } from "@/components/ui/input-numeric"
import { useToast } from "@/hooks/use-toast"

const TransferMoney = () => {
  const [pixKey, setPixKey] = useState("")
  const [amount, setAmount] = useState("")
  const { toast } = useToast()
  const router = useRouter()

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setPixKey(text)
      toast({
        title: "Key pasted successfully",
        description: "PIX key has been pasted from clipboard",
      })
    } catch {
      toast({
        title: "Paste failed",
        description: "Unable to access clipboard",
        variant: "destructive",
      })
    }
  }

  const handleDone = () => {
    if (!pixKey.trim()) {
      toast({
        title: "PIX key required",
        description: "Please enter a PIX key before proceeding",
        variant: "destructive",
      })
      return
    }

    if (!amount.trim()) {
      toast({
        title: "Amount required",
        description: "Please enter the amount in R$ before proceeding",
        variant: "destructive",
      })
      return
    }

    // Navigate to confirm-pay with data
    router.push(`/confirm-pay?pixKey=${encodeURIComponent(pixKey)}&amount=${encodeURIComponent(amount)}`)
  }

  const handleCameraScan = () => {
    toast({
      title: "Camera feature",
      description: "QR code scanning will be available soon",
    })
  }

  return (
    <div className="min-h-screen bg-stellar-gray flex items-center justify-center p-4 relative">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-card rounded-2xl shadow-lg border border-border p-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Transfer money</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Fill in the fields below or use camera phone to scan code
            </p>
          </div>

          {/* Form */}
          <div className="space-y-3">
            <label
              htmlFor="pixKey"
              className="block text-sm font-medium text-foreground"
            >
              Key Pix
            </label>
            <div className="relative">
              <Input
                id="pixKey"
                type="text"
                placeholder="CPF, CNPJ, phone, or email"
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
                className="bg-card text-foreground border-border pr-20 h-12 rounded-xl placeholder:text-muted-foreground/60"
              />
              <Button
                type="button"
                variant="stellar-paste"
                size="sm"
                onClick={handlePaste}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 px-3 rounded-lg"
              >
                <Copy className="w-3 h-3 mr-1" />
                Paste
              </Button>
            </div>

            <label
              htmlFor="amount"
              className="block text-sm font-medium text-foreground"
            >
              Amount in R$ to transfer
            </label>
            <InputNumeric
              value={amount}
              onValueChange={(values) => setAmount(values.value)}
              thousandSeparator
              prefix="R$ "
              decimalScale={2}
              fixedDecimalScale
              allowNegative={false}
              placeholder="Enter amount"
              className="bg-card text-foreground border-border pr-20 h-12 rounded-xl placeholder:text-muted-foreground/60"
            />

            <div className="flex items-start space-x-2 p-4 bg-stellar-black/10 rounded-lg">
              <Info className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                Connected wallet: <br />
                Not connected (UI only for now)
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button
              variant="stellar-secondary"
              size="lg"
              onClick={handleCameraScan}
              className="w-full h-14 rounded-xl text-base font-medium"
            >
              <Camera className="w-5 h-5 mr-3" />
              Use Camera Phone To Scan Code
            </Button>

            <Button
              variant="stellar"
              size="lg"
              onClick={handleDone}
              className="w-full h-14 rounded-xl text-base font-medium"
            >
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransferMoney
