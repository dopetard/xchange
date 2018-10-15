#!/bin/bash

docker build -t michael1011/btcd -f btcd/Dockerfile .
docker build -t michael1011/ltcd -f ltcd/Dockerfile .

docker build -t michael1011/lnd -f lnd/Dockerfile .
