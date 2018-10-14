FROM golang:1.11.1-alpine as builder

# Install git and make
RUN apk update && apk upgrade && apk add --no-cache git make

# Install LND
RUN git clone https://github.com/michael1011/lnd $GOPATH/src/github.com/michael1011/lnd

WORKDIR $GOPATH/src/github.com/michael1011/lnd
RUN git checkout ltcd-regtest-simnet && make dep && make build

# Start again with a new image to reduce the size
FROM alpine:3.8 as final

# Expose LND ports (server, gRPC)
EXPOSE 9735 10009

# Copy the binaries and entrypoint from the builder image.
COPY --from=builder /go/src/github.com/michael1011/lnd/lnd-debug /bin/lnd
COPY --from=builder /go/src/github.com/michael1011/lnd/lncli-debug /bin/lncli

# Copy the LND rpc certificates from the data directory 
COPY data /rpc

ENTRYPOINT ["lnd", "--noseedbackup", "--no-macaroons", "--debuglevel=debug", "--tlscertpath=/rpc/lnd/tls.cert", "--tlskeypath=/rpc/lnd/tls.key", "--rpclisten=0.0.0.0", "--listen=0.0.0.0:9735"]
