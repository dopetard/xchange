// package: wallirpc
// file: wallirpc.proto

/* tslint:disable */

import * as grpc from "grpc";
import * as wallirpc_pb from "./wallirpc_pb";

interface IWalliService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    sayHi: IWalliService_ISayHi;
}

interface IWalliService_ISayHi extends grpc.MethodDefinition<wallirpc_pb.Message, wallirpc_pb.Message> {
    path: string; // "/wallirpc.Walli/SayHi"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<wallirpc_pb.Message>;
    requestDeserialize: grpc.deserialize<wallirpc_pb.Message>;
    responseSerialize: grpc.serialize<wallirpc_pb.Message>;
    responseDeserialize: grpc.deserialize<wallirpc_pb.Message>;
}

export const WalliService: IWalliService;

export interface IWalliServer {
    sayHi: grpc.handleUnaryCall<wallirpc_pb.Message, wallirpc_pb.Message>;
}

export interface IWalliClient {
    sayHi(request: wallirpc_pb.Message, callback: (error: Error | null, response: wallirpc_pb.Message) => void): grpc.ClientUnaryCall;
    sayHi(request: wallirpc_pb.Message, metadata: grpc.Metadata, callback: (error: Error | null, response: wallirpc_pb.Message) => void): grpc.ClientUnaryCall;
    sayHi(request: wallirpc_pb.Message, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: wallirpc_pb.Message) => void): grpc.ClientUnaryCall;
}

export class WalliClient extends grpc.Client implements IWalliClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public sayHi(request: wallirpc_pb.Message, callback: (error: Error | null, response: wallirpc_pb.Message) => void): grpc.ClientUnaryCall;
    public sayHi(request: wallirpc_pb.Message, metadata: grpc.Metadata, callback: (error: Error | null, response: wallirpc_pb.Message) => void): grpc.ClientUnaryCall;
    public sayHi(request: wallirpc_pb.Message, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: Error | null, response: wallirpc_pb.Message) => void): grpc.ClientUnaryCall;
}
