# This file is based on the repository github.com/Roasbeef/btcd-in-a-box created by Roasbeef

FROM golang:1.11.1-alpine3.8
LABEL maintainer="Olaoluwa Osuntokun <laolu32@gmail.com>"

# Install Git
RUN apk update && apk upgrade && apk add --no-cache git

# Grab and install the latest version of btcd and it's dependencies.
RUN go get github.com/ltcsuite/ltcd/...

# testnet wallet, p2p, and rpc
# regtest rpc port is the same
EXPOSE 19332 19335 19334

# simnet wallet, p2p and rpc
EXPOSE 18332 18555 18556

# Copy files from "btcd" folder into container
COPY data /root/.ltcd

WORKDIR /root

ENTRYPOINT ["ltcd", "--regtest", "--configfile=.ltcd/ltcd.conf"]
