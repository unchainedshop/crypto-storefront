import "@unchainedshop/plugins/pricing/free-delivery";
import "@unchainedshop/plugins/pricing/delivery-swiss-tax";
import "@unchainedshop/plugins/pricing/free-payment";
import "@unchainedshop/plugins/pricing/order-items";
import "@unchainedshop/plugins/pricing/order-discount";
import "@unchainedshop/plugins/pricing/order-delivery";
import "@unchainedshop/plugins/pricing/order-payment";
import "@unchainedshop/plugins/pricing/product-catalog-price";
import "@unchainedshop/plugins/pricing/product-discount";
import "@unchainedshop/plugins/pricing/product-swiss-tax";
import setupCryptopayPricing from '@unchainedshop/plugins/pricing/product-price-cryptopay';

import "@unchainedshop/plugins/filters/strict-equal";
import "@unchainedshop/plugins/filters/local-search";

import '@unchainedshop/plugins/worker/BulkImportWorker';
import '@unchainedshop/plugins/worker/ZombieKillerWorker';
import '@unchainedshop/plugins/worker/GenerateOrderWorker';
import '@unchainedshop/plugins/worker/MessageWorker';
import "@unchainedshop/plugins/worker/external";
import "@unchainedshop/plugins/worker/http-request";
import "@unchainedshop/plugins/worker/heartbeat";
import "@unchainedshop/plugins/worker/email";
import "@unchainedshop/plugins/worker/sms";
import "@unchainedshop/plugins/worker/external";

import "@unchainedshop/plugins/files/gridfs/gridfs-adapter";
import setupGridFSWebhook from "@unchainedshop/plugins/files/gridfs/gridfs-webhook";
import "@unchainedshop/plugins/events/node-event-emitter";

import '@unchainedshop/plugins/delivery/send-message';

import setupCryptopay from '@unchainedshop/plugins/payment/cryptopay';

import { configureGridFSFileUploadModule } from "@unchainedshop/plugins/files/gridfs";
export * from './cryptopay';

export { setupCryptopay, setupCryptopayPricing, configureGridFSFileUploadModule, setupGridFSWebhook };