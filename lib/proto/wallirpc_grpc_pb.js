// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var wallirpc_pb = require('./wallirpc_pb.js');

function serialize_wallirpc_Message(arg) {
  if (!(arg instanceof wallirpc_pb.Message)) {
    throw new Error('Expected argument of type wallirpc.Message');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_wallirpc_Message(buffer_arg) {
  return wallirpc_pb.Message.deserializeBinary(new Uint8Array(buffer_arg));
}


var WalliService = exports.WalliService = {
  sayHi: {
    path: '/wallirpc.Walli/SayHi',
    requestStream: false,
    responseStream: false,
    requestType: wallirpc_pb.Message,
    responseType: wallirpc_pb.Message,
    requestSerialize: serialize_wallirpc_Message,
    requestDeserialize: deserialize_wallirpc_Message,
    responseSerialize: serialize_wallirpc_Message,
    responseDeserialize: deserialize_wallirpc_Message,
  },
};

exports.WalliClient = grpc.makeGenericClientConstructor(WalliService);
