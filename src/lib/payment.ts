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

const HORIZON =
  process.env.NEXT_PUBLIC_STELLAR_HORIZON_URL ||
  "https://horizon-testnet.stellar.org";

const NETWORK_PASSPHRASE =
  process.env.NEXT_PUBLIC_STELLAR_NETWORK_PASSPHRASE || Networks.TESTNET;

const server = new Horizon.Server(HORIZON);

export async function sendTestnetPayment({
  senderPubKey,
  destPubKey,
  amount,
}: {
  senderPubKey: string;
  destPubKey: string;
  amount: string;
}) {
  const source = await server.loadAccount(senderPubKey);

  const tx = new TransactionBuilder(source, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      Operation.payment({
        destination: destPubKey,
        asset: Asset.native(),
        amount,
      })
    )
    .setTimeout(60)
    .build();

  const { signedTxXdr, error } = await signTransaction(tx.toXDR(), {
    networkPassphrase: NETWORK_PASSPHRASE,
    address: senderPubKey,
  });
  if (error) throw new Error(error);

  const signedTx = TransactionBuilder.fromXDR(signedTxXdr, NETWORK_PASSPHRASE);
  return server.submitTransaction(signedTx);
}
