// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var wallirpc_pb = require('./wallirpc_pb.js');
var google_api_annotations_pb = require('./google/api/annotations_pb.js');

function serialize_wallirpc_GetInfoRequest(arg) {
  if (!(arg instanceof wallirpc_pb.GetInfoRequest)) {
    throw new Error('Expected argument of type wallirpc.GetInfoRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_wallirpc_GetInfoRequest(buffer_arg) {
  return wallirpc_pb.GetInfoRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_wallirpc_GetInfoResponse(arg) {
  if (!(arg instanceof wallirpc_pb.GetInfoResponse)) {
    throw new Error('Expected argument of type wallirpc.GetInfoResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_wallirpc_GetInfoResponse(buffer_arg) {
  return wallirpc_pb.GetInfoResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var WalliService = exports.WalliService = {
  getInfo: {
    path: '/wallirpc.Walli/getInfo',
    requestStream: false,
    responseStream: false,
    requestType: wallirpc_pb.GetInfoRequest,
    responseType: wallirpc_pb.GetInfoResponse,
    requestSerialize: serialize_wallirpc_GetInfoRequest,
    requestDeserialize: deserialize_wallirpc_GetInfoRequest,
    responseSerialize: serialize_wallirpc_GetInfoResponse,
    responseDeserialize: deserialize_wallirpc_GetInfoResponse,
  },
};

exports.WalliClient = grpc.makeGenericClientConstructor(WalliService);
