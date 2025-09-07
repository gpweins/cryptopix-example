"use client";

import {
  requestAccess,
  getNetworkDetails,
} from "@stellar/freighter-api";

/**
 * Conecta a extensão Freighter e retorna informações da carteira e da rede.
 *
 * @returns objeto contendo:
 *  - address: chave pública da carteira conectada
 *  - network: nome da rede (ex.: TESTNET, PUBLIC)
 *  - networkPassphrase: passphrase usada pela rede
 *  - horizonUrl: URL do servidor Horizon
 */
export async function connectFreighter() {
  // Solicita permissão ao usuário para acessar a carteira Freighter
  const { address, error } = await requestAccess();
  if (error) throw new Error(error);

  // Obtém os detalhes da rede configurada no Freighter
  const net = await getNetworkDetails();

  return {
    address,
    network: net.network,
    networkPassphrase: net.networkPassphrase,
    horizonUrl: net.networkUrl,
  };
};
