"use client"

import React, { useState, useEffect } from "react"
import { Info, Camera, Copy } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { InputNumeric } from "@/components/ui/input-numeric"
import { useToast } from "@/hooks/use-toast"
import { isConnected } from "@stellar/freighter-api"
import { ellipsis } from "@/lib/utils"
import { connectFreighter } from "@/lib/wallet"

const TransferMoney = () => {
  const [pixKey, setPixKey] = useState("")
  const [amount, setAmount] = useState("")
  const [wallet, setWallet] = useState<string | null>(null)
  const [summWallet, setSummWallet] = useState<string | null>(null)
  const [walletReady, setWalletReady] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  // Connect wallet on mount
  useEffect(() => {
    (async () => {
      try {
        const conn = await isConnected()
        if (!conn.isConnected) throw new Error("Freighter not installed/enabled")

        const { address } = await connectFreighter()
        setWallet(address)
        setSummWallet(ellipsis(address))
        setWalletReady(true)
      } catch {
        setWalletReady(false)
      }
    })()
  }, [])

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setPixKey(text)
      toast({ title: "Key pasted successfully" })
    } catch {
      toast({ title: "Paste failed", variant: "destructive" })
    }
  }

  const handleDone = () => {
    if (!pixKey.trim()) return toast({ title: "PIX key required", variant: "destructive" })
    if (!amount.trim()) return toast({ title: "Amount required", variant: "destructive" })
    if (!walletReady || !wallet) return toast({ title: "Wallet not connected", variant: "destructive" })

    router.push(`/confirm-pay?pixKey=${encodeURIComponent(pixKey)}&amount=${encodeURIComponent(amount)}&wallet=${wallet}`)
  }

  const handleCameraScan = () => toast({ title: "Camera feature", description: "QR code scanning soon" })

  return (
    <div className="min-h-screen bg-stellar-gray flex items-center justify-center p-4 relative">
      {!walletReady && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-xl shadow-lg text-center max-w-sm">
            <h2 className="text-lg font-semibold mb-2 text-foreground">Freighter Wallet Required</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Please install and connect your Freighter wallet to continue.
            </p>
            <Button
              variant="stellar"
              onClick={async () => {
                try {
                  const { address } = await connectFreighter()
                  setWallet(address)
                  setWalletReady(true)
                } catch {
                  toast({ title: "Connection failed", variant: "destructive" })
                }
              }}
              className="w-full"
            >
              Connect Wallet
            </Button>
          </div>
        </div>
      )}

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
            <label htmlFor="pixKey" className="block text-sm font-medium text-foreground">Key Pix</label>
            <div className="relative">
              <Input
                id="pixKey"
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
                disabled={!walletReady}
                placeholder="CPF, CNPJ, phone, or email"
                className="bg-card text-foreground border-border pr-20 h-12 rounded-xl placeholder:text-muted-foreground/60"
              />
              <Button
                variant="stellar-paste"
                size="sm"
                onClick={handlePaste}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 px-3 rounded-lg"
                disabled={!walletReady}
              >
                <Copy className="w-3 h-3 mr-1" /> Paste
              </Button>
            </div>

            <label htmlFor="amount" className="block text-sm font-medium text-foreground">Amount in R$</label>
            <InputNumeric
              value={amount}
              onValueChange={(v) => setAmount(v.value)}
              disabled={!walletReady}
              placeholder="Enter amount"
              thousandSeparator
              prefix="R$ "
              decimalScale={2}
              fixedDecimalScale
              allowNegative={false}
              className="bg-card text-foreground border-border pr-20 h-12 rounded-xl placeholder:text-muted-foreground/60"
            />

            <div className="flex items-start space-x-2 p-4 bg-stellar-black/10 rounded-lg">
              <Info className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">Connected wallet: <br /> {summWallet}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <Button className="w-full h-14 rounded-xl text-base font-medium" variant="stellar-secondary" size="lg" onClick={handleCameraScan} disabled={!walletReady}>
              <Camera className="w-5 h-5 mr-3" /> Use Camera Phone To Scan Code
            </Button>
            <Button className="w-full h-14 rounded-xl text-base font-medium" variant="stellar" size="lg" onClick={handleDone} disabled={!walletReady}>
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransferMoney
