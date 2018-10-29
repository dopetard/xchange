// package: xchangerpc
// file: xchangerpc.proto

/* tslint:disable */

import * as grpc from "grpc";
import * as xchangerpc_pb from "./xchangerpc_pb";

interface IXchangeService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    getInfo: IXchangeService_IGetInfo;
    getBalance: IXchangeService_IGetBalance;
    newAddress: IXchangeService_INewAddress;
    createSwap: IXchangeService_ICreateSwap;
    createReverseSwap: IXchangeService_ICreateReverseSwap;
    claimSwap: IXchangeService_IClaimSwap;
}

interface IXchangeService_IGetInfo extends grpc.MethodDefinition<xchangerpc_pb.GetInfoRequest, xchangerpc_pb.GetInfoResponse> {
    path: string; // "/xchangerpc.Xchange/GetInfo"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<xchangerpc_pb.GetInfoRequest>;
    requestDeserialize: grpc.deserialize<xchangerpc_pb.GetInfoRequest>;
    responseSerialize: grpc.serialize<xchangerpc_pb.GetInfoResponse>;
    responseDeserialize: grpc.deserialize<xchangerpc_pb.GetInfoResponse>;
}
interface IXchangeService_IGetBalance extends grpc.MethodDefinition<xchangerpc_pb.GetBalanceRequest, xchangerpc_pb.GetBalanceResponse> {
    path: string; // "/xchangerpc.Xchange/GetBalance"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<xchangerpc_pb.GetBalanceRequest>;
    requestDeserialize: grpc.deserialize<xchangerpc_pb.GetBalanceRequest>;
    responseSerialize: grpc.serialize<xchangerpc_pb.GetBalanceResponse>;
    responseDeserialize: grpc.deserialize<xchangerpc_pb.GetBalanceResponse>;
}
interface IXchangeService_INewAddress extends grpc.MethodDefinition<xchangerpc_pb.NewAddressRequest, xchangerpc_pb.NewAddressResponse> {
    path: string; // "/xchangerpc.Xchange/NewAddress"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<xchangerpc_pb.NewAddressRequest>;
    requestDeserialize: grpc.deserialize<xchangerpc_pb.NewAddressRequest>;
    responseSerialize: grpc.serialize<xchangerpc_pb.NewAddressResponse>;
    responseDeserialize: grpc.deserialize<xchangerpc_pb.NewAddressResponse>;
}
interface IXchangeService_ICreateSwap extends grpc.MethodDefinition<xchangerpc_pb.CreateSwapRequest, xchangerpc_pb.CreateSwapResponse> {
    path: string; // "/xchangerpc.Xchange/CreateSwap"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<xchangerpc_pb.CreateSwapRequest>;
    requestDeserialize: grpc.deserialize<xchangerpc_pb.CreateSwapRequest>;
    responseSerialize: grpc.serialize<xchangerpc_pb.CreateSwapResponse>;
    responseDeserialize: grpc.deserialize<xchangerpc_pb.CreateSwapResponse>;
}
interface IXchangeService_ICreateReverseSwap extends grpc.MethodDefinition<xchangerpc_pb.CreateReverseSwapRequest, xchangerpc_pb.CreateReverseSwapResponse> {
    path: string; // "/xchangerpc.Xchange/CreateReverseSwap"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<xchangerpc_pb.CreateReverseSwapRequest>;
    requestDeserialize: grpc.deserialize<xchangerpc_pb.CreateReverseSwapRequest>;
    responseSerialize: grpc.serialize<xchangerpc_pb.CreateReverseSwapResponse>;
    responseDeserialize: grpc.deserialize<xchangerpc_pb.CreateReverseSwapResponse>;
}
interface IXchangeService_IClaimSwap extends grpc.MethodDefinition<xchangerpc_pb.ClaimSwapRequest, xchangerpc_pb.ClaimSwapResponse> {
    path: string; // "/xchangerpc.Xchange/ClaimSwap"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<xchangerpc_pb.ClaimSwapRequest>;
    requestDeserialize: grpc.deserialize<xchangerpc_pb.ClaimSwapRequest>;
    responseSerialize: grpc.serialize<xchangerpc_pb.ClaimSwapResponse>;
    responseDeserialize: grpc.deserialize<xchangerpc_pb.ClaimSwapResponse>;
}

export const XchangeService: IXchangeService;

export interface IXchangeServer {
    getInfo: grpc.handleUnaryCall<xchangerpc_pb.GetInfoRequest, xchangerpc_pb.GetInfoResponse>;
    getBalance: grpc.handleUnaryCall<xchangerpc_pb.GetBalanceRequest, xchangerpc_pb.GetBalanceResponse>;
    newAddress: grpc.handleUnaryCall<xchangerpc_pb.NewAddressRequest, xchangerpc_pb.NewAddressResponse>;
    createSwap: grpc.handleUnaryCall<xchangerpc_pb.CreateSwapRequest, xchangerpc_pb.CreateSwapResponse>;
    createReverseSwap: grpc.handleUnaryCall<xchangerpc_pb.CreateReverseSwapRequest, xchangerpc_pb.CreateReverseSwapResponse>;
    claimSwap: grpc.handleUnaryCall<xchangerpc_pb.ClaimSwapRequest, xchangerpc_pb.ClaimSwapResponse>;
}

export interface IXchangeClient {
    getInfo(request: xchangerpc_pb.GetInfoRequest, callback: (error: Error | null, response: xchangerpc_pb.GetInfoResponse) => void): grpc.ClientUnaryCall;
    getInfo(request: xchangerpc_pb.GetInfoRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xchangerpc_pb.GetInfoResponse) => void): grpc.ClientUnaryCall;
    getInfo(request: xchangerpc_pb.GetInfoRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xchangerpc_pb.GetInfoResponse) => void): grpc.ClientUnaryCall;
    getBalance(request: xchangerpc_pb.GetBalanceRequest, callback: (error: Error | null, response: xchangerpc_pb.GetBalanceResponse) => void): grpc.ClientUnaryCall;
    getBalance(request: xchangerpc_pb.GetBalanceRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xchangerpc_pb.GetBalanceResponse) => void): grpc.ClientUnaryCall;
    getBalance(request: xchangerpc_pb.GetBalanceRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xchangerpc_pb.GetBalanceResponse) => void): grpc.ClientUnaryCall;
    newAddress(request: xchangerpc_pb.NewAddressRequest, callback: (error: Error | null, response: xchangerpc_pb.NewAddressResponse) => void): grpc.ClientUnaryCall;
    newAddress(request: xchangerpc_pb.NewAddressRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xchangerpc_pb.NewAddressResponse) => void): grpc.ClientUnaryCall;
    newAddress(request: xchangerpc_pb.NewAddressRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xchangerpc_pb.NewAddressResponse) => void): grpc.ClientUnaryCall;
    createSwap(request: xchangerpc_pb.CreateSwapRequest, callback: (error: Error | null, response: xchangerpc_pb.CreateSwapResponse) => void): grpc.ClientUnaryCall;
    createSwap(request: xchangerpc_pb.CreateSwapRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xchangerpc_pb.CreateSwapResponse) => void): grpc.ClientUnaryCall;
    createSwap(request: xchangerpc_pb.CreateSwapRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xchangerpc_pb.CreateSwapResponse) => void): grpc.ClientUnaryCall;
    createReverseSwap(request: xchangerpc_pb.CreateReverseSwapRequest, callback: (error: Error | null, response: xchangerpc_pb.CreateReverseSwapResponse) => void): grpc.ClientUnaryCall;
    createReverseSwap(request: xchangerpc_pb.CreateReverseSwapRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xchangerpc_pb.CreateReverseSwapResponse) => void): grpc.ClientUnaryCall;
    createReverseSwap(request: xchangerpc_pb.CreateReverseSwapRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xchangerpc_pb.CreateReverseSwapResponse) => void): grpc.ClientUnaryCall;
    claimSwap(request: xchangerpc_pb.ClaimSwapRequest, callback: (error: Error | null, response: xchangerpc_pb.ClaimSwapResponse) => void): grpc.ClientUnaryCall;
    claimSwap(request: xchangerpc_pb.ClaimSwapRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xchangerpc_pb.ClaimSwapResponse) => void): grpc.ClientUnaryCall;
    claimSwap(request: xchangerpc_pb.ClaimSwapRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xchangerpc_pb.ClaimSwapResponse) => void): grpc.ClientUnaryCall;
}

export class XchangeClient extends grpc.Client implements IXchangeClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public getInfo(request: xchangerpc_pb.GetInfoRequest, callback: (error: Error | null, response: xchangerpc_pb.GetInfoResponse) => void): grpc.ClientUnaryCall;
    public getInfo(request: xchangerpc_pb.GetInfoRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xchangerpc_pb.GetInfoResponse) => void): grpc.ClientUnaryCall;
    public getInfo(request: xchangerpc_pb.GetInfoRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xchangerpc_pb.GetInfoResponse) => void): grpc.ClientUnaryCall;
    public getBalance(request: xchangerpc_pb.GetBalanceRequest, callback: (error: Error | null, response: xchangerpc_pb.GetBalanceResponse) => void): grpc.ClientUnaryCall;
    public getBalance(request: xchangerpc_pb.GetBalanceRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xchangerpc_pb.GetBalanceResponse) => void): grpc.ClientUnaryCall;
    public getBalance(request: xchangerpc_pb.GetBalanceRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xchangerpc_pb.GetBalanceResponse) => void): grpc.ClientUnaryCall;
    public newAddress(request: xchangerpc_pb.NewAddressRequest, callback: (error: Error | null, response: xchangerpc_pb.NewAddressResponse) => void): grpc.ClientUnaryCall;
    public newAddress(request: xchangerpc_pb.NewAddressRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xchangerpc_pb.NewAddressResponse) => void): grpc.ClientUnaryCall;
    public newAddress(request: xchangerpc_pb.NewAddressRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xchangerpc_pb.NewAddressResponse) => void): grpc.ClientUnaryCall;
    public createSwap(request: xchangerpc_pb.CreateSwapRequest, callback: (error: Error | null, response: xchangerpc_pb.CreateSwapResponse) => void): grpc.ClientUnaryCall;
    public createSwap(request: xchangerpc_pb.CreateSwapRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xchangerpc_pb.CreateSwapResponse) => void): grpc.ClientUnaryCall;
    public createSwap(request: xchangerpc_pb.CreateSwapRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xchangerpc_pb.CreateSwapResponse) => void): grpc.ClientUnaryCall;
    public createReverseSwap(request: xchangerpc_pb.CreateReverseSwapRequest, callback: (error: Error | null, response: xchangerpc_pb.CreateReverseSwapResponse) => void): grpc.ClientUnaryCall;
    public createReverseSwap(request: xchangerpc_pb.CreateReverseSwapRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xchangerpc_pb.CreateReverseSwapResponse) => void): grpc.ClientUnaryCall;
    public createReverseSwap(request: xchangerpc_pb.CreateReverseSwapRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xchangerpc_pb.CreateReverseSwapResponse) => void): grpc.ClientUnaryCall;
    public claimSwap(request: xchangerpc_pb.ClaimSwapRequest, callback: (error: Error | null, response: xchangerpc_pb.ClaimSwapResponse) => void): grpc.ClientUnaryCall;
    public claimSwap(request: xchangerpc_pb.ClaimSwapRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xchangerpc_pb.ClaimSwapResponse) => void): grpc.ClientUnaryCall;
    public claimSwap(request: xchangerpc_pb.ClaimSwapRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xchangerpc_pb.ClaimSwapResponse) => void): grpc.ClientUnaryCall;
}
