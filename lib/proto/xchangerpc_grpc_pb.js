// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var xchangerpc_pb = require('./xchangerpc_pb.js');

function serialize_xchangerpc_CreateSwapRequest(arg) {
  if (!(arg instanceof xchangerpc_pb.CreateSwapRequest)) {
    throw new Error('Expected argument of type xchangerpc.CreateSwapRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xchangerpc_CreateSwapRequest(buffer_arg) {
  return xchangerpc_pb.CreateSwapRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xchangerpc_CreateSwapResponse(arg) {
  if (!(arg instanceof xchangerpc_pb.CreateSwapResponse)) {
    throw new Error('Expected argument of type xchangerpc.CreateSwapResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xchangerpc_CreateSwapResponse(buffer_arg) {
  return xchangerpc_pb.CreateSwapResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xchangerpc_GetBalanceRequest(arg) {
  if (!(arg instanceof xchangerpc_pb.GetBalanceRequest)) {
    throw new Error('Expected argument of type xchangerpc.GetBalanceRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xchangerpc_GetBalanceRequest(buffer_arg) {
  return xchangerpc_pb.GetBalanceRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xchangerpc_GetBalanceResponse(arg) {
  if (!(arg instanceof xchangerpc_pb.GetBalanceResponse)) {
    throw new Error('Expected argument of type xchangerpc.GetBalanceResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xchangerpc_GetBalanceResponse(buffer_arg) {
  return xchangerpc_pb.GetBalanceResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

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

function serialize_xchangerpc_NewAddressRequest(arg) {
  if (!(arg instanceof xchangerpc_pb.NewAddressRequest)) {
    throw new Error('Expected argument of type xchangerpc.NewAddressRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xchangerpc_NewAddressRequest(buffer_arg) {
  return xchangerpc_pb.NewAddressRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xchangerpc_NewAddressResponse(arg) {
  if (!(arg instanceof xchangerpc_pb.NewAddressResponse)) {
    throw new Error('Expected argument of type xchangerpc.NewAddressResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_xchangerpc_NewAddressResponse(buffer_arg) {
  return xchangerpc_pb.NewAddressResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var XchangeService = exports.XchangeService = {
  // Gets general information about this Xchange instance and the nodes it is connected to 
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
  // Gets the balance for either all wallets or just a single one if specified 
  getBalance: {
    path: '/xchangerpc.Xchange/GetBalance',
    requestStream: false,
    responseStream: false,
    requestType: xchangerpc_pb.GetBalanceRequest,
    responseType: xchangerpc_pb.GetBalanceResponse,
    requestSerialize: serialize_xchangerpc_GetBalanceRequest,
    requestDeserialize: deserialize_xchangerpc_GetBalanceRequest,
    responseSerialize: serialize_xchangerpc_GetBalanceResponse,
    responseDeserialize: deserialize_xchangerpc_GetBalanceResponse,
  },
  // Gets a new address of a specified wallet. The "type" parameter is optional and defaults to "OutputType.LEGACY" 
  newAddress: {
    path: '/xchangerpc.Xchange/NewAddress',
    requestStream: false,
    responseStream: false,
    requestType: xchangerpc_pb.NewAddressRequest,
    responseType: xchangerpc_pb.NewAddressResponse,
    requestSerialize: serialize_xchangerpc_NewAddressRequest,
    requestDeserialize: deserialize_xchangerpc_NewAddressRequest,
    responseSerialize: serialize_xchangerpc_NewAddressResponse,
    responseDeserialize: deserialize_xchangerpc_NewAddressResponse,
  },
  // Creates a new Swap from the chain to Lightning 
  createSwap: {
    path: '/xchangerpc.Xchange/CreateSwap',
    requestStream: false,
    responseStream: false,
    requestType: xchangerpc_pb.CreateSwapRequest,
    responseType: xchangerpc_pb.CreateSwapResponse,
    requestSerialize: serialize_xchangerpc_CreateSwapRequest,
    requestDeserialize: deserialize_xchangerpc_CreateSwapRequest,
    responseSerialize: serialize_xchangerpc_CreateSwapResponse,
    responseDeserialize: deserialize_xchangerpc_CreateSwapResponse,
  },
};

exports.XchangeClient = grpc.makeGenericClientConstructor(XchangeService);
