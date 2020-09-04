import { ApiPromise, WsProvider } from "@polkadot/api";
import { formatNumber } from "@polkadot/util";

import getBlock from "./get-block-impl";
import getOpts from "./get-opts";

const opts = getOpts();
let blockNumber = opts["block-number"] ? parseInt(opts["block-number"]) : 0;
let rpcProvider = opts["rpc-provider"] || "wss://kusama-rpc.polkadot.io";

(async () => {
  const wsProvider = new WsProvider(rpcProvider);
  const api = await ApiPromise.create({ provider: wsProvider });

  const runStart = Date.now();
  let count = 0;

  while (true) {
    await getBlock(api, blockNumber);
    ++blockNumber;
    ++count;

    if (count % 100 === 0) {
      console.log(
        "\n",
        `${formatNumber(count).padStart(10)} blocks, ${((Date.now() - runStart) / count).toFixed(2)}ms/block`,
        "\n"
      );
    }
  }
})();
