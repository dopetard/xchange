FROM golang:1.11.1-alpine as builder

# Install git and make
RUN apk update && apk upgrade && apk add --no-cache git

# Install the latest version of ltcd and it's dependencies
RUN go get github.com/ltcsuite/ltcd/...

# Generate the rpc certificate
RUN mkdir /rpc && gencerts --directory "/rpc"

# Start again with a new image to reduce the size
FROM alpine as final

# Expose testnet ports (server, rpc)
EXPOSE 19335 19334

# Expose simnet ports (server, rpc)
EXPOSE 18555 18556

# Expose regtest ports (server, rpc)
EXPOSE 18444 19334

# Copy the binaries from the builder image
COPY --from=builder /go/bin/ltcd /bin/
COPY --from=builder /go/bin/ltcctl /bin/

# Copy the rpc certificate from the builder image and add a volume for them 
COPY --from=builder /rpc /rpc
VOLUME ["/rpc"]

ENTRYPOINT ["ltcd", "--regtest", "--txindex", \
"--rpcuser=user", "--rpcpass=user", "--rpccert=/rpc/rpc.cert", "--rpckey=/rpc/rpc.key", "--rpclisten=0.0.0.0"]
