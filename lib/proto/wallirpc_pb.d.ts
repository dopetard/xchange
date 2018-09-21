// package: wallirpc
// file: wallirpc.proto

import * as jspb from "google-protobuf";
import * as google_api_annotations_pb from "./google/api/annotations_pb";

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

export class LndInfo extends jspb.Message {
  getVersion(): string;
  setVersion(value: string): void;

  clearChainsList(): void;
  getChainsList(): Array<string>;
  setChainsList(value: Array<string>): void;
  addChains(value: string, index?: number): string;

  getBlockheight(): number;
  setBlockheight(value: number): void;

  clearUrisList(): void;
  getUrisList(): Array<string>;
  setUrisList(value: Array<string>): void;
  addUris(value: string, index?: number): string;

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
    chainsList: Array<string>,
    blockheight: number,
    urisList: Array<string>,
    error: string,
  }
}

export class BtcdInfo extends jspb.Message {
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

  getDifficulty(): number;
  setDifficulty(value: number): void;

  getTestnet(): boolean;
  setTestnet(value: boolean): void;

  getRelayfee(): number;
  setRelayfee(value: number): void;

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
    timeoffset: number,
    connections: number,
    proxy: string,
    difficulty: number,
    testnet: boolean,
    relayfee: number,
  }
}

