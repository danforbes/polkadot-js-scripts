import { ApiPromise, WsProvider } from '@polkadot/api';
import { formatNumber } from '@polkadot/util';

let blockNumber = 0;
let rpcProvider = 'wss://kusama-rpc.polkadot.io';

const numArgs = process.argv.length;
for (let argNdx = 3; argNdx + 1 < numArgs; /* updated in loop */) {
  if (!process.argv[argNdx].startsWith('--')) {
    ++argNdx;
    continue;
  }

  switch (process.argv[argNdx].substring(2)) {
    case 'block-number': {
      blockNumber = parseInt(process.argv[argNdx + 1]);
      argNdx += 2;
      break;
    }

    case 'rpc-provider': {
      rpcProvider = process.argv[argNdx + 1];
      argNdx += 2;
      break;
    }

    default: {
      ++argNdx;
    }
  }
}

(async () => {
  const wsProvider = new WsProvider(rpcProvider);
  const api = await ApiPromise.create({ provider: wsProvider });

  const blockStart = Date.now();
  const hash = await api.rpc.chain.getBlockHash(blockNumber);
  const events = await api.query.system.events.at(hash);

  console.log(formatNumber(blockNumber).padStart(10), `${`${Date.now() - blockStart}`.padStart(7)}ms`,  events.map(({ event: { data: { method, section } } }) => `${section}.${method}`).join(', '));
  process.exit();
})();
