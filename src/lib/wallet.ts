"use client";

import {
  requestAccess,
  getNetworkDetails,
} from "@stellar/freighter-api";

export async function connectFreighter() {
  const { address, error } = await requestAccess();
  if (error) throw new Error(error);

  const net = await getNetworkDetails();
  return {
    address,
    network: net.network,
    networkPassphrase: net.networkPassphrase,
    horizonUrl: net.networkUrl,
  };
};
