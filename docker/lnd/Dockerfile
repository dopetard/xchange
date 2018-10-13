FROM golang:1.11.1-alpine as builder

# Install git and make
RUN apk update && apk upgrade && apk add --no-cache git make

# Install LND
RUN git clone https://github.com/lightningnetwork/lnd $GOPATH/src/github.com/lightningnetwork/lnd

WORKDIR $GOPATH/src/github.com/lightningnetwork/lnd 
RUN git checkout v0.5-beta && make dep && make install

# Start again with a new image to reduce the size
FROM alpine:3.8 as final

# Expose LND ports (server, gRPC)
EXPOSE 9735 10009

# Copy the binaries and entrypoint from the builder image.
COPY --from=builder /go/bin/lncli /bin/
COPY --from=builder /go/bin/lnd /bin/

ENTRYPOINT ["lnd", "--noseedbackup", "--no-macaroons", "--debuglevel=debug", "--tlscertpath=/rpc/lnd.cert", "--tlskeypath=/rpc/lnd.key"]
