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
    getVersion(): string;
    setVersion(value: string): void;


    hasBtcdinfo(): boolean;
    clearBtcdinfo(): void;
    getBtcdinfo(): BtcdInfo | undefined;
    setBtcdinfo(value?: BtcdInfo): void;


    hasLndinfo(): boolean;
    clearLndinfo(): void;
    getLndinfo(): LndInfo | undefined;
    setLndinfo(value?: LndInfo): void;


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
        version: string,
        btcdinfo?: BtcdInfo.AsObject,
        lndinfo?: LndInfo.AsObject,
    }
}

export class CreateSubmarineRequest extends jspb.Message { 
    getInvoice(): string;
    setInvoice(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CreateSubmarineRequest.AsObject;
    static toObject(includeInstance: boolean, msg: CreateSubmarineRequest): CreateSubmarineRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CreateSubmarineRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CreateSubmarineRequest;
    static deserializeBinaryFromReader(message: CreateSubmarineRequest, reader: jspb.BinaryReader): CreateSubmarineRequest;
}

export namespace CreateSubmarineRequest {
    export type AsObject = {
        invoice: string,
    }
}

export class CreateSubmarineResponse extends jspb.Message { 
    getRedeemscript(): string;
    setRedeemscript(value: string): void;


    hasAddresses(): boolean;
    clearAddresses(): void;
    getAddresses(): Addresses | undefined;
    setAddresses(value?: Addresses): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): CreateSubmarineResponse.AsObject;
    static toObject(includeInstance: boolean, msg: CreateSubmarineResponse): CreateSubmarineResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: CreateSubmarineResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): CreateSubmarineResponse;
    static deserializeBinaryFromReader(message: CreateSubmarineResponse, reader: jspb.BinaryReader): CreateSubmarineResponse;
}

export namespace CreateSubmarineResponse {
    export type AsObject = {
        redeemscript: string,
        addresses?: Addresses.AsObject,
    }
}

export class Addresses extends jspb.Message { 
    getBech32(): string;
    setBech32(value: string): void;

    getCompatibility(): string;
    setCompatibility(value: string): void;

    getLegacy(): string;
    setLegacy(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Addresses.AsObject;
    static toObject(includeInstance: boolean, msg: Addresses): Addresses.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Addresses, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Addresses;
    static deserializeBinaryFromReader(message: Addresses, reader: jspb.BinaryReader): Addresses;
}

export namespace Addresses {
    export type AsObject = {
        bech32: string,
        compatibility: string,
        legacy: string,
    }
}

export class LndInfo extends jspb.Message { 
    getVersion(): string;
    setVersion(value: string): void;


    hasLndchannels(): boolean;
    clearLndchannels(): void;
    getLndchannels(): LndChannels | undefined;
    setLndchannels(value?: LndChannels): void;

    getBlockheight(): number;
    setBlockheight(value: number): void;

    getError(): string;
    setError(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): LndInfo.AsObject;
    static toObject(includeInstance: boolean, msg: LndInfo): LndInfo.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: LndInfo, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): LndInfo;
    static deserializeBinaryFromReader(message: LndInfo, reader: jspb.BinaryReader): LndInfo;
}

export namespace LndInfo {
    export type AsObject = {
        version: string,
        lndchannels?: LndChannels.AsObject,
        blockheight: number,
        error: string,
    }
}

export class LndChannels extends jspb.Message { 
    getActive(): number;
    setActive(value: number): void;

    getInactive(): number;
    setInactive(value: number): void;

    getPending(): number;
    setPending(value: number): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): LndChannels.AsObject;
    static toObject(includeInstance: boolean, msg: LndChannels): LndChannels.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: LndChannels, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): LndChannels;
    static deserializeBinaryFromReader(message: LndChannels, reader: jspb.BinaryReader): LndChannels;
}

export namespace LndChannels {
    export type AsObject = {
        active: number,
        inactive: number,
        pending: number,
    }
}

export class BtcdInfo extends jspb.Message { 
    getVersion(): number;
    setVersion(value: number): void;

    getProtocolversion(): number;
    setProtocolversion(value: number): void;

    getBlocks(): number;
    setBlocks(value: number): void;

    getConnections(): number;
    setConnections(value: number): void;

    getTestnet(): boolean;
    setTestnet(value: boolean): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): BtcdInfo.AsObject;
    static toObject(includeInstance: boolean, msg: BtcdInfo): BtcdInfo.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: BtcdInfo, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): BtcdInfo;
    static deserializeBinaryFromReader(message: BtcdInfo, reader: jspb.BinaryReader): BtcdInfo;
}

export namespace BtcdInfo {
    export type AsObject = {
        version: number,
        protocolversion: number,
        blocks: number,
        connections: number,
        testnet: boolean,
    }
}
