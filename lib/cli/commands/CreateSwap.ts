import { Arguments } from 'yargs';
import * as qrcode from 'qrcode-terminal';
import { loadXchangeClient, GrpcResponse, printError, printResponse } from '../Command';
import { OutputTypeComponent, OrderSideComponent } from '../BuilderComponents';
import { CreateSwapRequest } from '../../proto/xchangerpc_pb';
import { getOutputType, getOrderSide } from '../Utils';

export const command = 'createswap <pair_id> <order_side> <invoice> [output_type] [refund_public_key] [show_qr]';

export const describe = 'create a new swap from the chain to Lightning';

export const builder = {
  pair_id: {
    describe: 'traiding pair id of the order',
    type: 'string',
  },
  order_side: OrderSideComponent,
  invoice: {
    describe: 'invoice to pay',
    type: 'string',
  },
  output_type: OutputTypeComponent,
  refund_public_key: {
    describe: 'public key with which a refund transaction has to be signed',
    type: 'string',
  },
  show_qr: {
    describe: 'whether a QR code for the BIP21 payment request',
    type: 'boolean',
  },
};

let showQr = false;

export const callback = (error: Error | null, response: GrpcResponse) => {
  if (error) {
    printError(error);
  } else {
    const responseObj = response.toObject();

    printResponse(responseObj);

    if (showQr) {
      console.log();
      qrcode.generate(responseObj.bip21, { small: true });
    }
  }
};

export const handler = (argv: Arguments) => {
  const request = new CreateSwapRequest();

  request.setPairId(argv.pair_id);
  request.setOrderSide(getOrderSide(argv.order_side));
  request.setInvoice(argv.invoice);
  request.setOutputType(getOutputType(argv.output_type));
  request.setRefundPublicKey(argv.refund_public_key);

  showQr = argv.show_qr;

  loadXchangeClient(argv).createSwap(request, callback);
};
