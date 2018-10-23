// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var xchangerpc_pb = require('./xchangerpc_pb.js');

function serialize_xchangerpc_GetInfoRequest(arg) {
  if (!(arg instanceof xchangerpc_pb.GetInfoRequest)) {
    throw new Error('Expected argument of type xchangerpc.GetInfoRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xchangerpc_GetInfoRequest(buffer_arg) {
  return xchangerpc_pb.GetInfoRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xchangerpc_GetInfoResponse(arg) {
  if (!(arg instanceof xchangerpc_pb.GetInfoResponse)) {
    throw new Error('Expected argument of type xchangerpc.GetInfoResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xchangerpc_GetInfoResponse(buffer_arg) {
  return xchangerpc_pb.GetInfoResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var XchangeService = exports.XchangeService = {
  getInfo: {
    path: '/xchangerpc.Xchange/GetInfo',
    requestStream: false,
    responseStream: false,
    requestType: xchangerpc_pb.GetInfoRequest,
    responseType: xchangerpc_pb.GetInfoResponse,
    requestSerialize: serialize_xchangerpc_GetInfoRequest,
    requestDeserialize: deserialize_xchangerpc_GetInfoRequest,
    responseSerialize: serialize_xchangerpc_GetInfoResponse,
    responseDeserialize: deserialize_xchangerpc_GetInfoResponse,
  },
};

exports.XchangeClient = grpc.makeGenericClientConstructor(XchangeService);
