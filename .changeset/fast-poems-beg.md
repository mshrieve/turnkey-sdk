---
"@turnkey/ethers": major
---

Updates @turnkey/ethers package and examples to use ethers v6. Refer to https://docs.ethers.org/v6/migrating for full migration instructions.

✨Summary of Changes✨

`getBalance` is no longer a method on the signer. It must be obtained via the provider instance.
Additionally, it requires an address to be passed in:

```
// before
const balance = await connectedSigner.getBalance();

// after
// first get the address
const address = await connectedSigner.getAddress()
// then pass it in
const balance = await connectedSigner.provider?.getBalance(address)
```

`getChainId` is no longer a method on the signer. It must be obtained via the network object on the provider instance:

```
// before
const chainId = await connectedSigner.getChainId();

// after
const chainId = (await connectedSigner.provider?.getNetwork())?.chainId;
```

`getTransactionCount` is no longer a method on the signer. It must be obtained via the provider instance.
Additionally, it requires an address to be passed in:

```
// before
const transactionCount = await connectedSigner.getTransactionCount();

// after
// first get the address
const address = await connectedSigner.getAddress()
// then pass it in
const transactionCount = await connectedSigner.provider?.getTransactionCount(address);
```

`getFeeData` is no longer a method on the signer. It must be obtained via the provider instance:

```
// before
const feeData = await connectedSigner.getFeeData();

// after
const feeData = await connectedSigner.provider?.getFeeData();
```

BigNumber -> bigint: numerical values such as, chainId, fee data, balance now use new ES6 primitive `bigint` instead of `BigNumber`.
For example, when checking if the balance is `0`, `bigint` must now be used for comparison:

```
// before
if (balance.isZero()) {...}

// after
if (balance === 0n) {...}
```