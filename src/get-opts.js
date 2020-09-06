export default () => {
  const opts = {};
  const numArgs = process.argv.length;
  for (let argNdx = 3; argNdx + 1 < numArgs /* updated in loop */; ) {
    if (!process.argv[argNdx].startsWith("--")) {
      ++argNdx;
      continue;
    }

    opts[process.argv[argNdx].substring(2)] = process.argv[argNdx + 1];
    argNdx += 2;
  }

  return opts;
};
