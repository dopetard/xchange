class GRPCError {
  public message: string;
  constructor(message: string) {
    this.message = message;
  }
}

export default {
  COULD_NOT_BIND: (port: string) => new GRPCError(`gRPC couldn't bind on port: ${port}`),
};
