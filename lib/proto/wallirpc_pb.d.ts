// package: wallirpc
// file: wallirpc.proto

/* tslint:disable */

import * as jspb from "google-protobuf";

export class GetInfoRequest extends jspb.Message { 

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetInfoRequest.AsObject;
    static toObject(includeInstance: boolean, msg: GetInfoRequest): GetInfoRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetInfoRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetInfoRequest;
    static deserializeBinaryFromReader(message: GetInfoRequest, reader: jspb.BinaryReader): GetInfoRequest;
}

export namespace GetInfoRequest {
    export type AsObject = {
    }
}

export class GetInfoResponse extends jspb.Message { 
    getVersion(): number;
    setVersion(value: number): void;

    getProtocolversion(): number;
    setProtocolversion(value: number): void;

    getBlocks(): number;
    setBlocks(value: number): void;

    getTimeoffset(): number;
    setTimeoffset(value: number): void;

    getConnections(): number;
    setConnections(value: number): void;

    getProxy(): string;
    setProxy(value: string): void;

    getDifficulty(): string;
    setDifficulty(value: string): void;

    getTestnet(): boolean;
    setTestnet(value: boolean): void;

    getRelayfee(): number;
    setRelayfee(value: number): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): GetInfoResponse.AsObject;
    static toObject(includeInstance: boolean, msg: GetInfoResponse): GetInfoResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: GetInfoResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): GetInfoResponse;
    static deserializeBinaryFromReader(message: GetInfoResponse, reader: jspb.BinaryReader): GetInfoResponse;
}

export namespace GetInfoResponse {
    export type AsObject = {
        version: number,
        protocolversion: number,
        blocks: number,
        timeoffset: number,
        connections: number,
        proxy: string,
        difficulty: string,
        testnet: boolean,
        relayfee: number,
    }
}
