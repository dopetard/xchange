// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var wallirpc_pb = require('./wallirpc_pb.js');
var google_api_annotations_pb = require('./google/api/annotations_pb.js');

function serialize_wallirpc_CreateSubmarineRequest(arg) {
  if (!(arg instanceof wallirpc_pb.CreateSubmarineRequest)) {
    throw new Error('Expected argument of type wallirpc.CreateSubmarineRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_wallirpc_CreateSubmarineRequest(buffer_arg) {
  return wallirpc_pb.CreateSubmarineRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_wallirpc_CreateSubmarineResponse(arg) {
  if (!(arg instanceof wallirpc_pb.CreateSubmarineResponse)) {
    throw new Error('Expected argument of type wallirpc.CreateSubmarineResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_wallirpc_CreateSubmarineResponse(buffer_arg) {
  return wallirpc_pb.CreateSubmarineResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_wallirpc_GetInfoRequest(arg) {
  if (!(arg instanceof wallirpc_pb.GetInfoRequest)) {
    throw new Error('Expected argument of type wallirpc.GetInfoRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_wallirpc_GetInfoRequest(buffer_arg) {
  return wallirpc_pb.GetInfoRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_wallirpc_GetInfoResponse(arg) {
  if (!(arg instanceof wallirpc_pb.GetInfoResponse)) {
    throw new Error('Expected argument of type wallirpc.GetInfoResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_wallirpc_GetInfoResponse(buffer_arg) {
  return wallirpc_pb.GetInfoResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var WalliService = exports.WalliService = {
  getInfo: {
    path: '/wallirpc.Walli/GetInfo',
    requestStream: false,
    responseStream: false,
    requestType: wallirpc_pb.GetInfoRequest,
    responseType: wallirpc_pb.GetInfoResponse,
    requestSerialize: serialize_wallirpc_GetInfoRequest,
    requestDeserialize: deserialize_wallirpc_GetInfoRequest,
    responseSerialize: serialize_wallirpc_GetInfoResponse,
    responseDeserialize: deserialize_wallirpc_GetInfoResponse,
  },
  createSubmarine: {
    path: '/wallirpc.Walli/CreateSubmarine',
    requestStream: false,
    responseStream: false,
    requestType: wallirpc_pb.CreateSubmarineRequest,
    responseType: wallirpc_pb.CreateSubmarineResponse,
    requestSerialize: serialize_wallirpc_CreateSubmarineRequest,
    requestDeserialize: deserialize_wallirpc_CreateSubmarineRequest,
    responseSerialize: serialize_wallirpc_CreateSubmarineResponse,
    responseDeserialize: deserialize_wallirpc_CreateSubmarineResponse,
  },
};

exports.WalliClient = grpc.makeGenericClientConstructor(WalliService);
