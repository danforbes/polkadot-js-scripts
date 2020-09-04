import { formatNumber } from "@polkadot/util";

export default async function (api, blockNumber) {
  const blockStart = Date.now();

  try {
    const hash = await api.rpc.chain.getBlockHash(blockNumber);
    const events = await api.query.system.events.at(hash);
    console.log(
      formatNumber(blockNumber).padStart(10),
      `${`${Date.now() - blockStart}`.padStart(7)}ms`,
      events
        .map(
          ({
            event: {
              data: { method, section },
            },
          }) => `${section}.${method}`
        )
        .join(", ")
    );
  } catch (e) {
    console.log(Array(80).fill("━").join(""));
    console.log("\n\n\n\n");
    console.log(`ERROR at block: ${formatNumber(blockNumber)}`);
    console.log(e);
    console.log("\n\n\n\n");
  }
}
