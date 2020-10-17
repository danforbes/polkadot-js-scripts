const fs = require("fs");
const path = require("path");

const subcommands = [
  {
    name: "get-blocks-from",
    description: "Get all block from a given starting height, or the genesis block if no height is specified.",
    usage: "get-blocks-from [--block-number <block number>] [--rpc-provider <RPC provider>]",
  },
  {
    name: "get-block",
    description: "Get a block given its height, or the genesis block if no height is specified.",
    usage: "get-block [--block-number <block number>] [--rpc-provider <RPC provider>]",
  },
  {
    name: "sign-tx",
    description: "WIP",
    usage: "sign-tx",
  },
];

const subCommandNames = {};
subcommands.forEach((subcommand) => {
  if (!isValidSubcommand(subcommand)) {
    return;
  }

  subCommandNames[subcommand.name] = subcommand;
});

const numArgs = process.argv.length;
if (3 > numArgs) {
  noSupportedSubcommand();
}

const subCommandName = process.argv[2];
const subcommand = subCommandNames[subCommandName];
if (!subcommand) {
  noSupportedSubcommand();
}

const subcommandDep = subcommand.dep || path.join(__dirname, subcommand.name);

if (!fs.existsSync(`${subcommandDep}.js`)) {
  console.error("Could not find dependency for subcommand.");
  process.exit(2);
}

try {
  require(subcommandDep);
} catch (err) {
  console.error("Error executing subcomand.");
  console.error(err.message);
  process.exit(3);
}

function noSupportedSubcommand() {
  console.error("You must provide a supported subcommand. The supported subcommands are:");
  subcommands.forEach((subcommand) => {
    if (!isValidSubcommand(subcommand)) {
      return;
    }

    console.error(` > ${subcommand.name} - ${subcommand.description}`);
  });

  process.exit(1);
}

function isValidSubcommand(subcommand) {
  return subcommand.name && subcommand.description;
}
