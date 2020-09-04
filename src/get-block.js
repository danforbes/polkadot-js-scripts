import { ApiPromise, WsProvider } from "@polkadot/api";

import getBlock from "./get-block-impl";
import getOpts from "./get-opts";

const opts = getOpts();
let blockNumber = opts["block-number"] ? parseInt(opts["block-number"]) : 0;
let rpcProvider = opts["rpc-provider"] || "wss://kusama-rpc.polkadot.io";

(async () => {
  const wsProvider = new WsProvider(rpcProvider);
  const api = await ApiPromise.create({ provider: wsProvider });
  await getBlock(api, blockNumber);
  process.exit();
})();
