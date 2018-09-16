import BaseClient from '../BaseClient';

// TODO: listen to transactions sent to specifc addresses

/**
 * A generic interface that can be used for multiple chain nodes and implementations
 */
interface ChainClient extends BaseClient {
  sendRawTransaction(rawTransaction: string): Promise<any>;
}

export default ChainClient;
