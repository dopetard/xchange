
# Xchange Product Requirement Document

Run your own exchange

# Intro & Goal

XChange, an open-source white-label exchange solution for everyone with built-in liquidity. The goal of XChange is it to enable technically capably individuals, as well as tech entrepreneurs to operate a digital asset exchange and offer this service to friends & family or as a business to the open public. XChange’s technology is developed by the XChange team and comes with the liquidity and trading pairs within Exchange Union. XChange is an important step in the gradual transition towards decentralisation of the asset exchange ecosystem and will enable the launch thousands of new digital asset exchanges all over the world.

Xchange is an add-on on top of exchange union ecosystem with the intent to make on-boarding of users easier. By connecting his or her wallet to an Xchange service provider, a user will be able to instantly start trading digital assets via XUD without needing to go through the initial friction of running a XUD node. This makes crypto on-ramping frictionless and allows for greater accessibility for normal users while retaining the arc of financial self sovereignty. 

# Who’s it for?

- Tech Entrepreneurs
- Technically capable people who want to be their own exchange

# Why build it?

Non custodial and decentralised exchanges are going to play a big part in the future of exchange of digital assets. XChange will provide a plug and play solution for tech entrepreneurs looking to start their own decentralised exchange. Current white label exchange solution provided by various centralised exchanges are, by definition, custodial in nature and don't abstract away or eradicate the regulatory problems entailing it. We provide entrepreneurs with location agnostic tools to start a decentralised exchange and help usher a new era of financial sovereignty. 

# Technological Architecture

The core technology which makes XChange possible was first introduced by the CTO of Lightning Labs — [Olaoluwa Osuntokun](https://twitter.com/roasbeef). It's called **Submarine Swaps.**

Submarine Swaps let users send Lightning payments to a middleman on the Lightning Network; that middleman will send a corresponding amount of Bitcoin to a regular (on-chain) Bitcoin address. It also works the other way around: users can send regular on-chain payments to the middleman; that middleman will then send a corresponding amount of Bitcoin to a receiving lightning node on the Lightning Network. A Submarine Swap has an on-chain side that can be on virtually any chain, so the alt-coins don’t need to have SegWit or a Lightning implementation for this to work. Everything the chain has to support is some simple scripting and time-locks. Although there is a middleman involved Submarine Swaps are completely trust-less and can get refunded if the middleman is dishonest and refuses to do its duty.

Submarine Swaps between on-chain LTC to off-chain BTC haven been successfully tested recently by Alex Bosworth.

[Alex's Tweet](https://twitter.com/alexbosworth/status/1025168088595984384)

In conclusion Submarine Swaps allow users to swap funds on-chain to off-chain, off-chain to on-chain, and tangled together on-chain to on-chain. Users would not need a second layer wallet. Submarine Swaps can make any permutations of on-chain and off-chain swaps possible. The following picture depicts our proposed architecture

![](https://github.com/dopetard/xchange/blob/master/docs/Xchange%20Network.png)

XChange has a centralised matching engine order book, it is running a XUD full node and connecting to all other XUDs through it.

The picture below depicts one specific case of tangled submarine swap that allows off-chain to on-chain exchange of assets. Consider a scenario where Alice is using an on-chain wallet, but she only has Ethereum in her off-chain wallet. She intends to buy 2000 XUC for her 1 ETH. Alice sends her 1 ETH to Xchange via her off-chain wallet. Xchange puts on the order to exchange Alice's Ether for XUC via XUD instance. After a successful completion of an atomic swap, Xchange has 2000 XUC in it's second layer wallet which should be sent to Alice, but here's a catch - Alice doesn't have inbound channel balance and wants her XUC in the on-chain  wallet, so Xchange uses a Submarine Swap to transfer her XUC off-chain to her on-chain wallet - all this while maintaining the trustlessness of the system. In the case of Xchange not being able to liquidate those 1 Ether, it initiates a refund. The business model made possible by this architecture is also pretty straightforward - Xchange is essentially a submarine swap provider and makes money via swapping and routing fees. The problem of stale orders can be mitigated by constant pruning of order book.

![](https://github.com/dopetard/xchange/blob/master/docs/Submarine%20Swap.png)

The picture below depicts the flow of the preimage in case of a swap in which the user receives funds on-chain (which will probably be used most of the time):

Consider a scenario in which the user wants to trade 10 LTC on Lightning for 1 BTC on the chain:

1. Xchange generates the preimage and locks up the funds the user wants to receive (1 BTC)
2. The user locks up the funds he want to sell (10 LTC on Lightning)
3. Xcahnge tells XUD to place a new order with the aforementioned amounts 
4. Once that XUD order is filled Xchange claims the funds locked up by the user (10 lightning-LTC)
5. Because claiming locked up funds reveals the preimage the user is now able to claim their funds too (1 BTC)  

![](https://github.com/dopetard/xchange/blob/dopetard-doc-fixes/docs/PreImageFlow.png)

In one special case of the user wanting to receive off-chain, the preimage is controlled by the user, resulting in a different preimage flow:

1. The user generates a lightning invoice with the amount the user wants to buy (1 BTC); that includes generating a preimage
2. Because the preimage is controlled by the user locking up the funds the user wants to sell (10 lightning-LTC) has to get initiated first
3. Then Xchange tells XUD to place a new order with the aforementioned amounts
4. When the XUD order is filled Xcahnge pays the Lightning invoice of the user which reveals the preimage
5. And therefore Xchange is able to claim the funds locked up by the user (10 lightning-LTC)

# Tech Notes

- **Using different preimage for internal XUD and external swap between Xchange and user**
  - In the swap protocol 2 of XUD, the taker is initiating the swap and hence XChange service provider wouldn't be able to be a maker because it'll be unclear which preimage will be used by the time the user locks up funds.
  - In case the same preimage is used, the order which should be filled has to be specified before the user locks up the funds, resulting in high error rates because of stale orders.
  - Multiple makers and takers filling the orders wouldn't be possible.
  - It's simply a better UX and less developer cost to not tangle everything together. Debugging is lot more easier.

- **Countering the spam problem while executing reverse submarine swap between Xchange ← → and the user.**
  - While executing an off-chain to on-chain swap, there is a risk of  malicious actors bankrupting the XChange service provider by spamming with off-chain invoices resulting in XChange service provider locking up funds on chain which is costly because of fees paid to the miners. Repeating this step can be fatal for the service provider.  

    The need of an appropriate reputation system or a staking mechanism is required to counter this problem. A certain combination of staking up XUC and using decentralised DNS name providers like Blockstack or Namebase can be explored. 

    [Namebase](https://namebase.io/) in a top-level domain service built on top of handshake protocol. Exact workflow is tbd but using namebase subdomain might be too cheap to deter an motivated attacker. We might have to explore using XUC staking mechanism in adjacent to this solution.

- **Need for a reserve**
  - In the current architectural design, the internal tangled submarine swap between Xchange and user is detached from the external swap carried out between XUDs. Hence this whole process is not atomic with different preimage being used for internal and external swap. Due to this fact, there is a need for the Xchange service provider to have certain amount of funds in reserve to be able to keep this whole process trustless. The amount of reserve can be thought of as the commutative sum of simultaneous number of trade the Xchange service provider wants to power at a given point in time.  

- **Wallet compatibility**
  - This wallet agnostic claiming feature can be achieved by detaching and re-delegating the key signing part from wallet to browser. The key that has to sign the claiming transaction is hardcoded in the swap itself, but there is no rules as to which specific key gets hardcoded. This abstracts out the task to the browser and hence circumvents the problem of wallet compatibility. For the whole swap to be trustless, the user needs to be able to sign with the key that only user has, that doesn’t necessarily has to be the key of the destination address of the user for aforementioned reason. There are few different ways in which user can sign the key, user can choose to use the secp256k1 library that would generate the key natively in browser client side, which user can then use for signing the transaction. This makes for a smooth user experience. Alternatively, user can use the supported wallet that supports key management, for example: Electrum or Samurai with PSBT (BIP 174)  In case while sending on chain Ethereum or ERC20 funds, users can choose to use Metamask, that would make the end user experience more frictionless by autofilling the key.

# Future Ideas

- React/Redux Frontend for XChange Service provider
- Docker bundle for easy self hosting of XChange for self sovereign individuals
- Channel rebalancing with either Submarine Swaps or purely off-chain with multiple channels
