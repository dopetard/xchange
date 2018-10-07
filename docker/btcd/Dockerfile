# This file is based on the repository github.com/Roasbeef/btcd-in-a-box created by Roasbeef

FROM golang:1.11.1-alpine3.8
LABEL maintainer="Olaoluwa Osuntokun <laolu32@gmail.com>"

# Install Git
RUN apk update && apk upgrade && apk add --no-cache git

# Grab and install the latest version of btcd and it's dependencies.
RUN go get github.com/btcsuite/btcd/...

# testnet wallet, p2p, and rpc
# regtest rpc port is the same
EXPOSE 18332 18333 18334

# simnet wallet, p2p and rpc
EXPOSE 18332 18555 18556

# Copy files from "btcd" folder into container
COPY data /root/.btcd

WORKDIR /root

ENTRYPOINT ["btcd", "--regtest", "--configfile=.btcd/btcd.conf"]
