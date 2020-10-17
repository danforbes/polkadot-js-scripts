import { ApiPromise, WsProvider, Keyring } from "@polkadot/api";

import getOpts from "./get-opts";

async function main() {
  const opts = getOpts();
  const rpcProvider = opts["rpc-provider"] || "wss://kusama-rpc.polkadot.io";
  const wsProvider = new WsProvider(rpcProvider);
  const api = await ApiPromise.create({ provider: wsProvider, types: {Address: "AccountId", LookupSource: "AccountId"} });

  const keyring = new Keyring({ type: "sr25519" });
  const owner = keyring.addFromUri("0xe5be9a5092b81bca64be81d212e7f2f9eba183bb7a90954f7b76361f6edb5c0a");
  const genesis = (await api.rpc.chain.getBlockHash(0)).toU8a();
  const current = (await api.rpc.chain.getBlockHash()).toU8a();
  const nonce = (await api.query.system.account(owner.address)).nonce.toU8a();

  // call + address + sig(call + extra + additional) + extra
  const call = api.tx.system.remark("Dan Forbes");
  let extra = new Uint8Array();
  let additional = new Uint8Array();
  api.runtimeMetadata.registry.signedExtensions.forEach(async (extension) => {
    switch (extension) {
      case "CheckSpecVersion": {
        additional = Uint8Array.from([...additional, ...api.registry.createType("u32", api.runtimeVersion.specVersion).toU8a()]);
        break;
      }

      case "CheckTxVersion": {
        additional = Uint8Array.from([...additional, ...api.registry.createType("u32", api.runtimeVersion.transactionVersion).toU8a()]);
        break;
      }

      case "CheckGenesis": {
        additional = Uint8Array.from([...additional, ...genesis]);
        break;
      }

      case "CheckMortality": {
        additional = Uint8Array.from([...additional, ...current]);
        extra = Uint8Array.from([...extra, ...api.registry.createType("u64", 5).toU8a()]);
        break;
      }

      case "CheckNonce": {
        extra = Uint8Array.from([...extra, ...nonce]);
        break;
      }

      case "CheckWeight": {
        // no-op
        break;
      }

      case "ChargeTransactionPayment": {
        extra = Uint8Array.from([...extra, ...api.registry.createType("Compact<Balance>", 5).toU8a()]);
        break;
      }

      default: {
        throw new Error(`Unknown signed extension: ${signedExtension}.`);
      }
    }
  });

  const toHexStr = (str, byte) => str + byte.toString(16).padStart(2, '0');
  const sig = owner.sign(Uint8Array.from([...call.toU8a(), ...extra, ...additional])).reduce(toHexStr, '');
  console.log("Call:       " + call.toHex().substr(2));
  console.log("Address:    " + owner.addressRaw.reduce(toHexStr, ''));
  console.log("Extra:      " + extra.reduce(toHexStr, ''));
  console.log("Additional: " + additional.reduce(toHexStr, ''));
  console.log("Signed:     " + sig);
  console.log();
  console.log((await api.tx.system.remark("Dan Forbes").signAsync(owner)).toHex());
}

main().catch(console.error).finally(() => process.exit());
