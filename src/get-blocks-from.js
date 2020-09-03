import { ApiPromise, WsProvider } from '@polkadot/api';
import { formatNumber } from '@polkadot/util';

let blockNumber = 0;
const numArgs = process.argv.length;
if (3 < numArgs) {
  blockNumber = parseInt(process.argv[3]);
}

let rpcProvider = 'wss://kusama-rpc.polkadot.io';
if (4 < numArgs) {
  rpcProvider = process.argv[4];
}

(async () => {
  const wsProvider = new WsProvider(rpcProvider);
  const api = await ApiPromise.create({ provider: wsProvider });

  const runStart = Date.now();
  let count = 0;

  while (true) {
    const blockStart = Date.now();
    const hash = await api.rpc.chain.getBlockHash(blockNumber);
    const events = await api.query.system.events.at(hash);

    console.log(formatNumber(blockNumber).padStart(10), `${`${Date.now() - blockStart}`.padStart(7)}ms`,  events.map(({ event: { data: { method, section } } }) => `${section}.${method}`).join(', '));

    blockNumber++;
    count++;

    if (count % 100 === 0) {
      console.log('\n', `${formatNumber(count).padStart(10)} blocks, ${((Date.now() - runStart) / count).toFixed(2)}ms/block`, '\n');
    }
  }
})();
