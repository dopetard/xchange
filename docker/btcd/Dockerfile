FROM golang:1.4.3
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

RUN mkdir /root/.btcd && mkdir /root/.btcctl

# Generate an automatic RPC conf.
ADD initrpc.go /root/
WORKDIR /root
RUN go build -o gen-config && ./gen-config

ENTRYPOINT ["btcd"]
