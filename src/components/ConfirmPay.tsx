"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Info } from "lucide-react"
import { useRouter } from "next/navigation"
import { sendTestnetPayment } from "@/lib/payment"

const ConfirmPay = () => {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const [pixKey, setPixKey] = useState("")
  const [amount, setAmount] = useState("")
  const [wallet, setWallet] = useState<string | null>(null)

  /**
   * Hook de efeito para carregar dados da transferência
   * armazenados na sessionStorage ao montar o componente.
   */
  useEffect(() => {
    const stored = sessionStorage.getItem("transferData")
    if (stored) {
      const { pixKey, amount, wallet } = JSON.parse(stored)
      setPixKey(pixKey)
      setAmount(amount)
      setWallet(wallet)
    }
  }, [])

  /** Navega de volta para a tela inicial */
  const handleBack = () => router.push("/")

  /**
   * Realiza a transferência de valores usando Freighter e Stellar Testnet.
   * Faz validação da carteira e amount, exibe toasts para feedback
   * e navega de volta após conclusão.
   */
  const handleTransferMoney = async () => {
    if (!wallet) return toast({ title: "Wallet not connected", variant: "destructive" })

    setLoading(true)
    toast({ title: "Processing transfer", description: `Transferring R$ ${amount} via Stellar Network` })

    // Recupera chave pública de destino do arquivo .env.local
    const destPubKey = process.env.NEXT_PUBLIC_DESTINATION_WALLET;
    if (!destPubKey) {
      toast({
        title: "Config error",
        description: "Destination wallet not configured in .env.local",
        className: "bg-red-500 text-white",
      });
      return;
    }

    // Formata o valor para o padrão aceito pelo Stellar (string com ponto como separador decimal)
    const formattedAmount = amount.replace(/[^\d.,]/g, "").replace(",", ".");

    try {
      // Envia o pagamento usando Stellar SDK + Freighter
      await sendTestnetPayment({
        senderPubKey: wallet,
        destPubKey,
        amount: formattedAmount,
      })
      toast({ title: "Transfer completed", description: "Money transferred successfully" })
      router.push("/")
    } catch (err: any) {
      toast({ title: "Transfer failed", description: err.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-stellar-gray flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-card rounded-2xl shadow-lg border border-border p-8 space-y-8">
          {/* Cabeçalho */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={handleBack} className="p-2 h-auto">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Button>
            <h1 className="text-xl font-semibold text-foreground">Confirm Pay</h1>
          </div>

          {/* Informações do destinatário */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Recipient</h2>
              <p className="text-foreground font-medium">{pixKey}</p>
              <p className="text-muted-foreground text-sm">
                Transfer on: {new Date().toLocaleDateString()}
              </p>
            </div>

            {/* Valor a ser transferido */}
            <div className="text-center py-6">
              <p className="text-4xl font-bold text-foreground">R$ {amount}</p>
            </div>

            {/* Caixa de informações */}
            <div className="flex items-start space-x-2 p-4 bg-stellar-black/10 rounded-lg">
              <Info className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                Transfers made with CriptoPix are instant and fees included.
              </p>
            </div>
          </div>

          {/* Botão de ação principal */}
          <div className="space-y-4">
            <Button
              variant="stellar"
              size="lg"
              onClick={handleTransferMoney}
              disabled={loading}
              className="w-full h-14 rounded-xl text-base font-medium"
            >
              {loading ? "Processing..." : "Transfer Money"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmPay
