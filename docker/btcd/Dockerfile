FROM golang:1.10
#This file is based on the repository github.com/Roasbeef/btcd-in-a-box created by Roasbeef
MAINTAINER Olaoluwa Osuntokun <laolu32@gmail.com>

# Grab and install the latest version of btcd and it's dependencies.
RUN go get github.com/btcsuite/btcd/...

# wallet, p2p, and rpc
EXPOSE 8332 8333 8334

# testnet wallet, p2p, and rpc
EXPOSE 18332 18333 18334

#simnet wallet, p2p and rpc
EXPOSE 18332 18555 18556

# Generate an automatic RPC conf.
COPY btcd.conf /root/.btcd/btcd.conf
COPY btcctl.conf /root/.btcd/btcctl.conf
WORKDIR /root


ENTRYPOINT ["btcd"]