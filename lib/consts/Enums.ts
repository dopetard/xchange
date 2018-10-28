export enum ErrorCodePrefix {
  General = 0,
  Grpc = 1,
  Service = 2,
  Wallet = 3,
  Chain = 4,
  Lnd = 5,
  Swap = 6,
}

export enum OutputType {
  Bech32,
  // Nested SegWit
  Compatibility,
  Legacy,
}
