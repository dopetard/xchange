// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var xudrpc_pb = require('./xudrpc_pb.js');
var annotations_pb = require('./annotations_pb.js');

function serialize_xudrpc_AddInvoiceRequest(arg) {
  if (!(arg instanceof xudrpc_pb.AddInvoiceRequest)) {
    throw new Error('Expected argument of type xudrpc.AddInvoiceRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_AddInvoiceRequest(buffer_arg) {
  return xudrpc_pb.AddInvoiceRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_AddInvoiceResponse(arg) {
  if (!(arg instanceof xudrpc_pb.AddInvoiceResponse)) {
    throw new Error('Expected argument of type xudrpc.AddInvoiceResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_AddInvoiceResponse(buffer_arg) {
  return xudrpc_pb.AddInvoiceResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_CancelOrderRequest(arg) {
  if (!(arg instanceof xudrpc_pb.CancelOrderRequest)) {
    throw new Error('Expected argument of type xudrpc.CancelOrderRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_CancelOrderRequest(buffer_arg) {
  return xudrpc_pb.CancelOrderRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_CancelOrderResponse(arg) {
  if (!(arg instanceof xudrpc_pb.CancelOrderResponse)) {
    throw new Error('Expected argument of type xudrpc.CancelOrderResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_CancelOrderResponse(buffer_arg) {
  return xudrpc_pb.CancelOrderResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_ConnectRequest(arg) {
  if (!(arg instanceof xudrpc_pb.ConnectRequest)) {
    throw new Error('Expected argument of type xudrpc.ConnectRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_ConnectRequest(buffer_arg) {
  return xudrpc_pb.ConnectRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_ConnectResponse(arg) {
  if (!(arg instanceof xudrpc_pb.ConnectResponse)) {
    throw new Error('Expected argument of type xudrpc.ConnectResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_ConnectResponse(buffer_arg) {
  return xudrpc_pb.ConnectResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_DecodeInvoiceResponse(arg) {
  if (!(arg instanceof xudrpc_pb.DecodeInvoiceResponse)) {
    throw new Error('Expected argument of type xudrpc.DecodeInvoiceResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_DecodeInvoiceResponse(buffer_arg) {
  return xudrpc_pb.DecodeInvoiceResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_DisconnectRequest(arg) {
  if (!(arg instanceof xudrpc_pb.DisconnectRequest)) {
    throw new Error('Expected argument of type xudrpc.DisconnectRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_DisconnectRequest(buffer_arg) {
  return xudrpc_pb.DisconnectRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_DisconnectResponse(arg) {
  if (!(arg instanceof xudrpc_pb.DisconnectResponse)) {
    throw new Error('Expected argument of type xudrpc.DisconnectResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_DisconnectResponse(buffer_arg) {
  return xudrpc_pb.DisconnectResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_ExecuteSwapRequest(arg) {
  if (!(arg instanceof xudrpc_pb.ExecuteSwapRequest)) {
    throw new Error('Expected argument of type xudrpc.ExecuteSwapRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_ExecuteSwapRequest(buffer_arg) {
  return xudrpc_pb.ExecuteSwapRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_ExecuteSwapResponse(arg) {
  if (!(arg instanceof xudrpc_pb.ExecuteSwapResponse)) {
    throw new Error('Expected argument of type xudrpc.ExecuteSwapResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_ExecuteSwapResponse(buffer_arg) {
  return xudrpc_pb.ExecuteSwapResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_GetInfoRequest(arg) {
  if (!(arg instanceof xudrpc_pb.GetInfoRequest)) {
    throw new Error('Expected argument of type xudrpc.GetInfoRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_GetInfoRequest(buffer_arg) {
  return xudrpc_pb.GetInfoRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_GetInfoResponse(arg) {
  if (!(arg instanceof xudrpc_pb.GetInfoResponse)) {
    throw new Error('Expected argument of type xudrpc.GetInfoResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_GetInfoResponse(buffer_arg) {
  return xudrpc_pb.GetInfoResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_GetOrdersRequest(arg) {
  if (!(arg instanceof xudrpc_pb.GetOrdersRequest)) {
    throw new Error('Expected argument of type xudrpc.GetOrdersRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_GetOrdersRequest(buffer_arg) {
  return xudrpc_pb.GetOrdersRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_GetOrdersResponse(arg) {
  if (!(arg instanceof xudrpc_pb.GetOrdersResponse)) {
    throw new Error('Expected argument of type xudrpc.GetOrdersResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_GetOrdersResponse(buffer_arg) {
  return xudrpc_pb.GetOrdersResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_GetPairsRequest(arg) {
  if (!(arg instanceof xudrpc_pb.GetPairsRequest)) {
    throw new Error('Expected argument of type xudrpc.GetPairsRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_GetPairsRequest(buffer_arg) {
  return xudrpc_pb.GetPairsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_GetPairsResponse(arg) {
  if (!(arg instanceof xudrpc_pb.GetPairsResponse)) {
    throw new Error('Expected argument of type xudrpc.GetPairsResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_GetPairsResponse(buffer_arg) {
  return xudrpc_pb.GetPairsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_InvoiceRequest(arg) {
  if (!(arg instanceof xudrpc_pb.InvoiceRequest)) {
    throw new Error('Expected argument of type xudrpc.InvoiceRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_InvoiceRequest(buffer_arg) {
  return xudrpc_pb.InvoiceRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_PayInvoiceResponse(arg) {
  if (!(arg instanceof xudrpc_pb.PayInvoiceResponse)) {
    throw new Error('Expected argument of type xudrpc.PayInvoiceResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_PayInvoiceResponse(buffer_arg) {
  return xudrpc_pb.PayInvoiceResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_PlaceOrderRequest(arg) {
  if (!(arg instanceof xudrpc_pb.PlaceOrderRequest)) {
    throw new Error('Expected argument of type xudrpc.PlaceOrderRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_PlaceOrderRequest(buffer_arg) {
  return xudrpc_pb.PlaceOrderRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_PlaceOrderResponse(arg) {
  if (!(arg instanceof xudrpc_pb.PlaceOrderResponse)) {
    throw new Error('Expected argument of type xudrpc.PlaceOrderResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_PlaceOrderResponse(buffer_arg) {
  return xudrpc_pb.PlaceOrderResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_RaidenAddressRequest(arg) {
  if (!(arg instanceof xudrpc_pb.RaidenAddressRequest)) {
    throw new Error('Expected argument of type xudrpc.RaidenAddressRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_RaidenAddressRequest(buffer_arg) {
  return xudrpc_pb.RaidenAddressRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_RaidenAddressResponse(arg) {
  if (!(arg instanceof xudrpc_pb.RaidenAddressResponse)) {
    throw new Error('Expected argument of type xudrpc.RaidenAddressResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_RaidenAddressResponse(buffer_arg) {
  return xudrpc_pb.RaidenAddressResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_SendTokenReponse(arg) {
  if (!(arg instanceof xudrpc_pb.SendTokenReponse)) {
    throw new Error('Expected argument of type xudrpc.SendTokenReponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_SendTokenReponse(buffer_arg) {
  return xudrpc_pb.SendTokenReponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_SendTokenRequest(arg) {
  if (!(arg instanceof xudrpc_pb.SendTokenRequest)) {
    throw new Error('Expected argument of type xudrpc.SendTokenRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_SendTokenRequest(buffer_arg) {
  return xudrpc_pb.SendTokenRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_ShutdownRequest(arg) {
  if (!(arg instanceof xudrpc_pb.ShutdownRequest)) {
    throw new Error('Expected argument of type xudrpc.ShutdownRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_ShutdownRequest(buffer_arg) {
  return xudrpc_pb.ShutdownRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_ShutdownResponse(arg) {
  if (!(arg instanceof xudrpc_pb.ShutdownResponse)) {
    throw new Error('Expected argument of type xudrpc.ShutdownResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_ShutdownResponse(buffer_arg) {
  return xudrpc_pb.ShutdownResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_SubscribeChannelEventsRequest(arg) {
  if (!(arg instanceof xudrpc_pb.SubscribeChannelEventsRequest)) {
    throw new Error('Expected argument of type xudrpc.SubscribeChannelEventsRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_SubscribeChannelEventsRequest(buffer_arg) {
  return xudrpc_pb.SubscribeChannelEventsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_SubscribeChannelEventsResponse(arg) {
  if (!(arg instanceof xudrpc_pb.SubscribeChannelEventsResponse)) {
    throw new Error('Expected argument of type xudrpc.SubscribeChannelEventsResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_SubscribeChannelEventsResponse(buffer_arg) {
  return xudrpc_pb.SubscribeChannelEventsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_SubscribeInvoicesRequest(arg) {
  if (!(arg instanceof xudrpc_pb.SubscribeInvoicesRequest)) {
    throw new Error('Expected argument of type xudrpc.SubscribeInvoicesRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_SubscribeInvoicesRequest(buffer_arg) {
  return xudrpc_pb.SubscribeInvoicesRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_SubscribeInvoicesResponse(arg) {
  if (!(arg instanceof xudrpc_pb.SubscribeInvoicesResponse)) {
    throw new Error('Expected argument of type xudrpc.SubscribeInvoicesResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_SubscribeInvoicesResponse(buffer_arg) {
  return xudrpc_pb.SubscribeInvoicesResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_SubscribePeerOrdersRequest(arg) {
  if (!(arg instanceof xudrpc_pb.SubscribePeerOrdersRequest)) {
    throw new Error('Expected argument of type xudrpc.SubscribePeerOrdersRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_SubscribePeerOrdersRequest(buffer_arg) {
  return xudrpc_pb.SubscribePeerOrdersRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_SubscribePeerOrdersResponse(arg) {
  if (!(arg instanceof xudrpc_pb.SubscribePeerOrdersResponse)) {
    throw new Error('Expected argument of type xudrpc.SubscribePeerOrdersResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_SubscribePeerOrdersResponse(buffer_arg) {
  return xudrpc_pb.SubscribePeerOrdersResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_SubscribeSwapsRequest(arg) {
  if (!(arg instanceof xudrpc_pb.SubscribeSwapsRequest)) {
    throw new Error('Expected argument of type xudrpc.SubscribeSwapsRequest');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_SubscribeSwapsRequest(buffer_arg) {
  return xudrpc_pb.SubscribeSwapsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_xudrpc_SubscribeSwapsResponse(arg) {
  if (!(arg instanceof xudrpc_pb.SubscribeSwapsResponse)) {
    throw new Error('Expected argument of type xudrpc.SubscribeSwapsResponse');
  }
  return new Buffer(arg.serializeBinary());
}

function deserialize_xudrpc_SubscribeSwapsResponse(buffer_arg) {
  return xudrpc_pb.SubscribeSwapsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var XudService = exports.XudService = {
  // Get general information about this Exchange Union node. 
  getInfo: {
    path: '/xudrpc.Xud/GetInfo',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.GetInfoRequest,
    responseType: xudrpc_pb.GetInfoResponse,
    requestSerialize: serialize_xudrpc_GetInfoRequest,
    requestDeserialize: deserialize_xudrpc_GetInfoRequest,
    responseSerialize: serialize_xudrpc_GetInfoResponse,
    responseDeserialize: deserialize_xudrpc_GetInfoResponse,
  },
  // Get the list of the order book's available pairs. 
  getPairs: {
    path: '/xudrpc.Xud/GetPairs',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.GetPairsRequest,
    responseType: xudrpc_pb.GetPairsResponse,
    requestSerialize: serialize_xudrpc_GetPairsRequest,
    requestDeserialize: deserialize_xudrpc_GetPairsRequest,
    responseSerialize: serialize_xudrpc_GetPairsResponse,
    responseDeserialize: deserialize_xudrpc_GetPairsResponse,
  },
  // Get a list of standing orders from the order book. 
  getOrders: {
    path: '/xudrpc.Xud/GetOrders',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.GetOrdersRequest,
    responseType: xudrpc_pb.GetOrdersResponse,
    requestSerialize: serialize_xudrpc_GetOrdersRequest,
    requestDeserialize: deserialize_xudrpc_GetOrdersRequest,
    responseSerialize: serialize_xudrpc_GetOrdersResponse,
    responseDeserialize: deserialize_xudrpc_GetOrdersResponse,
  },
  // Add an order to the order book. 
  placeOrder: {
    path: '/xudrpc.Xud/PlaceOrder',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.PlaceOrderRequest,
    responseType: xudrpc_pb.PlaceOrderResponse,
    requestSerialize: serialize_xudrpc_PlaceOrderRequest,
    requestDeserialize: deserialize_xudrpc_PlaceOrderRequest,
    responseSerialize: serialize_xudrpc_PlaceOrderResponse,
    responseDeserialize: deserialize_xudrpc_PlaceOrderResponse,
  },
  // Cancel placed order from the orderbook. 
  cancelOrder: {
    path: '/xudrpc.Xud/CancelOrder',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.CancelOrderRequest,
    responseType: xudrpc_pb.CancelOrderResponse,
    requestSerialize: serialize_xudrpc_CancelOrderRequest,
    requestDeserialize: deserialize_xudrpc_CancelOrderRequest,
    responseSerialize: serialize_xudrpc_CancelOrderResponse,
    responseDeserialize: deserialize_xudrpc_CancelOrderResponse,
  },
  // Connect to an XU node on a given host and port. 
  connect: {
    path: '/xudrpc.Xud/Connect',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.ConnectRequest,
    responseType: xudrpc_pb.ConnectResponse,
    requestSerialize: serialize_xudrpc_ConnectRequest,
    requestDeserialize: deserialize_xudrpc_ConnectRequest,
    responseSerialize: serialize_xudrpc_ConnectResponse,
    responseDeserialize: deserialize_xudrpc_ConnectResponse,
  },
  // Disconnect from a connected peer XU node on a given host and port. 
  disconnect: {
    path: '/xudrpc.Xud/Disconnect',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.DisconnectRequest,
    responseType: xudrpc_pb.DisconnectResponse,
    requestSerialize: serialize_xudrpc_DisconnectRequest,
    requestDeserialize: deserialize_xudrpc_DisconnectRequest,
    responseSerialize: serialize_xudrpc_DisconnectResponse,
    responseDeserialize: deserialize_xudrpc_DisconnectResponse,
  },
  // Execute an atomic swap. 
  executeSwap: {
    path: '/xudrpc.Xud/ExecuteSwap',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.ExecuteSwapRequest,
    responseType: xudrpc_pb.ExecuteSwapResponse,
    requestSerialize: serialize_xudrpc_ExecuteSwapRequest,
    requestDeserialize: deserialize_xudrpc_ExecuteSwapRequest,
    responseSerialize: serialize_xudrpc_ExecuteSwapResponse,
    responseDeserialize: deserialize_xudrpc_ExecuteSwapResponse,
  },
  // Add a new Lightning invoice. 
  addInvoice: {
    path: '/xudrpc.Xud/AddInvoice',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.AddInvoiceRequest,
    responseType: xudrpc_pb.AddInvoiceResponse,
    requestSerialize: serialize_xudrpc_AddInvoiceRequest,
    requestDeserialize: deserialize_xudrpc_AddInvoiceRequest,
    responseSerialize: serialize_xudrpc_AddInvoiceResponse,
    responseDeserialize: deserialize_xudrpc_AddInvoiceResponse,
  },
  // Decode a Lightning invoice. 
  decodeInvoice: {
    path: '/xudrpc.Xud/DecodeInvoice',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.InvoiceRequest,
    responseType: xudrpc_pb.DecodeInvoiceResponse,
    requestSerialize: serialize_xudrpc_InvoiceRequest,
    requestDeserialize: deserialize_xudrpc_InvoiceRequest,
    responseSerialize: serialize_xudrpc_DecodeInvoiceResponse,
    responseDeserialize: deserialize_xudrpc_DecodeInvoiceResponse,
  },
  // Pay a Lightning invoice. 
  payInvoice: {
    path: '/xudrpc.Xud/PayInvoice',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.InvoiceRequest,
    responseType: xudrpc_pb.PayInvoiceResponse,
    requestSerialize: serialize_xudrpc_InvoiceRequest,
    requestDeserialize: deserialize_xudrpc_InvoiceRequest,
    responseSerialize: serialize_xudrpc_PayInvoiceResponse,
    responseDeserialize: deserialize_xudrpc_PayInvoiceResponse,
  },
  // Get the address of the Raiden instance. 
  raidenAddress: {
    path: '/xudrpc.Xud/RaidenAddress',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.RaidenAddressRequest,
    responseType: xudrpc_pb.RaidenAddressResponse,
    requestSerialize: serialize_xudrpc_RaidenAddressRequest,
    requestDeserialize: deserialize_xudrpc_RaidenAddressRequest,
    responseSerialize: serialize_xudrpc_RaidenAddressResponse,
    responseDeserialize: deserialize_xudrpc_RaidenAddressResponse,
  },
  // Initiate a Raiden token transfer. 
  sendToken: {
    path: '/xudrpc.Xud/SendToken',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.SendTokenRequest,
    responseType: xudrpc_pb.SendTokenReponse,
    requestSerialize: serialize_xudrpc_SendTokenRequest,
    requestDeserialize: deserialize_xudrpc_SendTokenRequest,
    responseSerialize: serialize_xudrpc_SendTokenReponse,
    responseDeserialize: deserialize_xudrpc_SendTokenReponse,
  },
  // Shutdown the xud daemon. 
  shutdown: {
    path: '/xudrpc.Xud/Shutdown',
    requestStream: false,
    responseStream: false,
    requestType: xudrpc_pb.ShutdownRequest,
    responseType: xudrpc_pb.ShutdownResponse,
    requestSerialize: serialize_xudrpc_ShutdownRequest,
    requestDeserialize: deserialize_xudrpc_ShutdownRequest,
    responseSerialize: serialize_xudrpc_ShutdownResponse,
    responseDeserialize: deserialize_xudrpc_ShutdownResponse,
  },
  // Subscribe to incoming peer orders. 
  subscribePeerOrders: {
    path: '/xudrpc.Xud/SubscribePeerOrders',
    requestStream: false,
    responseStream: true,
    requestType: xudrpc_pb.SubscribePeerOrdersRequest,
    responseType: xudrpc_pb.SubscribePeerOrdersResponse,
    requestSerialize: serialize_xudrpc_SubscribePeerOrdersRequest,
    requestDeserialize: deserialize_xudrpc_SubscribePeerOrdersRequest,
    responseSerialize: serialize_xudrpc_SubscribePeerOrdersResponse,
    responseDeserialize: deserialize_xudrpc_SubscribePeerOrdersResponse,
  },
  // Subscribe executed swaps. 
  subscribeSwaps: {
    path: '/xudrpc.Xud/SubscribeSwaps',
    requestStream: false,
    responseStream: true,
    requestType: xudrpc_pb.SubscribeSwapsRequest,
    responseType: xudrpc_pb.SubscribeSwapsResponse,
    requestSerialize: serialize_xudrpc_SubscribeSwapsRequest,
    requestDeserialize: deserialize_xudrpc_SubscribeSwapsRequest,
    responseSerialize: serialize_xudrpc_SubscribeSwapsResponse,
    responseDeserialize: deserialize_xudrpc_SubscribeSwapsResponse,
  },
  // Subscribe to all settled Lightning invoices. 
  subscribeInvoices: {
    path: '/xudrpc.Xud/SubscribeInvoices',
    requestStream: false,
    responseStream: true,
    requestType: xudrpc_pb.SubscribeInvoicesRequest,
    responseType: xudrpc_pb.SubscribeInvoicesResponse,
    requestSerialize: serialize_xudrpc_SubscribeInvoicesRequest,
    requestDeserialize: deserialize_xudrpc_SubscribeInvoicesRequest,
    responseSerialize: serialize_xudrpc_SubscribeInvoicesResponse,
    responseDeserialize: deserialize_xudrpc_SubscribeInvoicesResponse,
  },
  // Subscribe to all own Raiden channel events. 
  subscribeChannelEvents: {
    path: '/xudrpc.Xud/SubscribeChannelEvents',
    requestStream: false,
    responseStream: true,
    requestType: xudrpc_pb.SubscribeChannelEventsRequest,
    responseType: xudrpc_pb.SubscribeChannelEventsResponse,
    requestSerialize: serialize_xudrpc_SubscribeChannelEventsRequest,
    requestDeserialize: deserialize_xudrpc_SubscribeChannelEventsRequest,
    responseSerialize: serialize_xudrpc_SubscribeChannelEventsResponse,
    responseDeserialize: deserialize_xudrpc_SubscribeChannelEventsResponse,
  },
};

exports.XudClient = grpc.makeGenericClientConstructor(XudService);
