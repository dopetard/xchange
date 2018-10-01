// package: wallirpc
// file: wallirpc.proto

/* tslint:disable */

import * as grpc from "grpc";
import * as wallirpc_pb from "./wallirpc_pb";

interface IWalliService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    getInfo: IWalliService_IGetInfo;
    createSubmarine: IWalliService_ICreateSubmarine;
}

interface IWalliService_IGetInfo extends grpc.MethodDefinition<wallirpc_pb.GetInfoRequest, wallirpc_pb.GetInfoResponse> {
    path: string; // "/wallirpc.Walli/GetInfo"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<wallirpc_pb.GetInfoRequest>;
    requestDeserialize: grpc.deserialize<wallirpc_pb.GetInfoRequest>;
    responseSerialize: grpc.serialize<wallirpc_pb.GetInfoResponse>;
    responseDeserialize: grpc.deserialize<wallirpc_pb.GetInfoResponse>;
}
interface IWalliService_ICreateSubmarine extends grpc.MethodDefinition<wallirpc_pb.CreateSubmarineRequest, wallirpc_pb.CreateSubmarineResponse> {
    path: string; // "/wallirpc.Walli/CreateSubmarine"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<wallirpc_pb.CreateSubmarineRequest>;
    requestDeserialize: grpc.deserialize<wallirpc_pb.CreateSubmarineRequest>;
    responseSerialize: grpc.serialize<wallirpc_pb.CreateSubmarineResponse>;
    responseDeserialize: grpc.deserialize<wallirpc_pb.CreateSubmarineResponse>;
}

export const WalliService: IWalliService;

export interface IWalliServer {
    getInfo: grpc.handleUnaryCall<wallirpc_pb.GetInfoRequest, wallirpc_pb.GetInfoResponse>;
    createSubmarine: grpc.handleUnaryCall<wallirpc_pb.CreateSubmarineRequest, wallirpc_pb.CreateSubmarineResponse>;
}

export interface IWalliClient {
    getInfo(request: wallirpc_pb.GetInfoRequest, callback: (error: Error | null, response: wallirpc_pb.GetInfoResponse) => void): grpc.ClientUnaryCall;
    getInfo(request: wallirpc_pb.GetInfoRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: wallirpc_pb.GetInfoResponse) => void): grpc.ClientUnaryCall;
    getInfo(request: wallirpc_pb.GetInfoRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: wallirpc_pb.GetInfoResponse) => void): grpc.ClientUnaryCall;
    createSubmarine(request: wallirpc_pb.CreateSubmarineRequest, callback: (error: Error | null, response: wallirpc_pb.CreateSubmarineResponse) => void): grpc.ClientUnaryCall;
    createSubmarine(request: wallirpc_pb.CreateSubmarineRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: wallirpc_pb.CreateSubmarineResponse) => void): grpc.ClientUnaryCall;
    createSubmarine(request: wallirpc_pb.CreateSubmarineRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: wallirpc_pb.CreateSubmarineResponse) => void): grpc.ClientUnaryCall;
}

export class WalliClient extends grpc.Client implements IWalliClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public getInfo(request: wallirpc_pb.GetInfoRequest, callback: (error: Error | null, response: wallirpc_pb.GetInfoResponse) => void): grpc.ClientUnaryCall;
    public getInfo(request: wallirpc_pb.GetInfoRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: wallirpc_pb.GetInfoResponse) => void): grpc.ClientUnaryCall;
    public getInfo(request: wallirpc_pb.GetInfoRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: wallirpc_pb.GetInfoResponse) => void): grpc.ClientUnaryCall;
    public createSubmarine(request: wallirpc_pb.CreateSubmarineRequest, callback: (error: Error | null, response: wallirpc_pb.CreateSubmarineResponse) => void): grpc.ClientUnaryCall;
    public createSubmarine(request: wallirpc_pb.CreateSubmarineRequest, metadata: grpc.Metadata, callback: (error: Error | null, response: wallirpc_pb.CreateSubmarineResponse) => void): grpc.ClientUnaryCall;
    public createSubmarine(request: wallirpc_pb.CreateSubmarineRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: wallirpc_pb.CreateSubmarineResponse) => void): grpc.ClientUnaryCall;
}
