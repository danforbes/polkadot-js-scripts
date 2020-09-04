Install deps:

```
yarn
```

``` Dump logs from starting from a block until failure
NODE_ENV=test yarn start get-blocks-from --block-number 3860498 --rpc-provider ws_url > out.log
```

``` Dump logs from a single block
NODE_ENV=test yarn start get-block --block-number 3860498 --rpc-provider ws_url > out.lot
```
