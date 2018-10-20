// package: xchangerpc
// file: xchangerpc.proto

/* tslint:disable */

import * as grpc from "grpc";
import * as xchangerpc_pb from "./xchangerpc_pb";

interface IXchangeService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    getInfo: IXchangeService_IGetInfo;
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

export const XchangeService: IXchangeService;

export interface IXchangeServer {
    getInfo: grpc.handleUnaryCall<xchangerpc_pb.GetInfoRequest, xchangerpc_pb.GetInfoResponse>;
}

export interface IXchangeClient {
    getInfo(request: xchangerpc_pb.GetInfoRequest, callback: (error: Error | null, response: xchangerpc_pb.GetInfoResponse) => void): grpc.ClientUnaryCall;
    getInfo(request: xchangerpc_pb.GetInfoRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xchangerpc_pb.GetInfoResponse) => void): grpc.ClientUnaryCall;
    getInfo(request: xchangerpc_pb.GetInfoRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xchangerpc_pb.GetInfoResponse) => void): grpc.ClientUnaryCall;
}

export class XchangeClient extends grpc.Client implements IXchangeClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public getInfo(request: xchangerpc_pb.GetInfoRequest, callback: (error: Error | null, response: xchangerpc_pb.GetInfoResponse) => void): grpc.ClientUnaryCall;
    public getInfo(request: xchangerpc_pb.GetInfoRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xchangerpc_pb.GetInfoResponse) => void): grpc.ClientUnaryCall;
    public getInfo(request: xchangerpc_pb.GetInfoRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xchangerpc_pb.GetInfoResponse) => void): grpc.ClientUnaryCall;
}
