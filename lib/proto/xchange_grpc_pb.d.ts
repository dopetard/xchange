// package: xchangerpc
// file: xchange.proto

/* tslint:disable */

import * as grpc from "grpc";
import * as xchange_pb from "./xchange_pb";

interface IXchangeService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    getInfo: IXchangeService_IGetInfo;
}

interface IXchangeService_IGetInfo extends grpc.MethodDefinition<xchange_pb.GetInfoRequest, xchange_pb.GetInfoResponse> {
    path: string; // "/xchangerpc.Xchange/GetInfo"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<xchange_pb.GetInfoRequest>;
    requestDeserialize: grpc.deserialize<xchange_pb.GetInfoRequest>;
    responseSerialize: grpc.serialize<xchange_pb.GetInfoResponse>;
    responseDeserialize: grpc.deserialize<xchange_pb.GetInfoResponse>;
}

export const XchangeService: IXchangeService;

export interface IXchangeServer {
    getInfo: grpc.handleUnaryCall<xchange_pb.GetInfoRequest, xchange_pb.GetInfoResponse>;
}

export interface IXchangeClient {
    getInfo(request: xchange_pb.GetInfoRequest, callback: (error: Error | null, response: xchange_pb.GetInfoResponse) => void): grpc.ClientUnaryCall;
    getInfo(request: xchange_pb.GetInfoRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xchange_pb.GetInfoResponse) => void): grpc.ClientUnaryCall;
    getInfo(request: xchange_pb.GetInfoRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xchange_pb.GetInfoResponse) => void): grpc.ClientUnaryCall;
}

export class XchangeClient extends grpc.Client implements IXchangeClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public getInfo(request: xchange_pb.GetInfoRequest, callback: (error: Error | null, response: xchange_pb.GetInfoResponse) => void): grpc.ClientUnaryCall;
    public getInfo(request: xchange_pb.GetInfoRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: xchange_pb.GetInfoResponse) => void): grpc.ClientUnaryCall;
    public getInfo(request: xchange_pb.GetInfoRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: xchange_pb.GetInfoResponse) => void): grpc.ClientUnaryCall;
}
