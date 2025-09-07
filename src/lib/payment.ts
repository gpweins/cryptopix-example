"use client";

import {
  Asset,
  BASE_FEE,
  Horizon,
  Networks,
  Operation,
  TransactionBuilder,
} from "@stellar/stellar-sdk";
import { signTransaction } from "@stellar/freighter-api";

// URL do servidor Horizon (padrão: Testnet, mas pode ser sobrescrito via .env)
const HORIZON =
  process.env.NEXT_PUBLIC_STELLAR_HORIZON_URL ||
  "https://horizon-testnet.stellar.org";

// Passphrase da rede (Testnet por padrão, mas configurável via .env)
const NETWORK_PASSPHRASE =
  process.env.NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE || Networks.TESTNET;

// Instância do servidor Horizon para interagir com a rede Stellar
const server = new Horizon.Server(HORIZON);

/**
 * Função para enviar pagamentos em XLM (moeda nativa do Stellar).
 *
 * @param senderPubKey - chave pública da carteira que envia
 * @param destPubKey   - chave pública do destinatário
 * @param amount       - valor a ser transferido (string, até 7 casas decimais)
 */
export async function sendTestnetPayment({
  senderPubKey,
  destPubKey,
  amount,
}: {
  senderPubKey: string;
  destPubKey: string;
  amount: string;
}) {
  // Carrega a conta do remetente (necessário para obter sequence number, etc.)
  const source = await server.loadAccount(senderPubKey);

  // Constrói a transação sem assinar
  const tx = new TransactionBuilder(source, {
    fee: BASE_FEE, // taxa mínima por operação
    networkPassphrase: NETWORK_PASSPHRASE, // garante compatibilidade com Testnet
  })
    .addOperation(
      Operation.payment({
        destination: destPubKey,   // chave pública do destinatário
        asset: Asset.native(),     // XLM (ativo nativo)
        amount,                    // valor como string
      })
    )
    .setTimeout(60) // tempo máximo para submissão
    .build();

  // Solicita ao Freighter a assinatura da transação
  const { signedTxXdr, error } = await signTransaction(tx.toXDR(), {
    networkPassphrase: NETWORK_PASSPHRASE,
    address: senderPubKey,
  });
  if (error) throw new Error(error);

  // Reconstrói a transação assinada a partir do XDR
  const signedTx = TransactionBuilder.fromXDR(signedTxXdr, NETWORK_PASSPHRASE);

  // Submete a transação assinada para a rede
  return server.submitTransaction(signedTx);
}
