import { SDK } from "@/core/app/sdk";
import { MeliServices } from "./services/meli-services";
import {
  AzureDataTableIntegration,
  BasicPayloadCredentials,
} from "@/core/app/azure-datatable.integration";
import {
  processLojaIntegradaOrdersFromQueue,
  sendLojaIntegradaOrdersPaginationToQueue,
} from "./process/process-loja-integrada";

process.env.RUNNER = true;

SDK.bootstrap();

const meliServices = new MeliServices();

const azureDataTableServices = new AzureDataTableIntegration({
  account: process.env.DB_ACCOUNT,
  accountKey: process.env.DB_ACCOUNT_KEY,
  url: process.env.DB_CONNECTION_URL,
  table: process.env.DT_TABLE,
});

const UNLOCK = false;

const handler = async () => {
  if (UNLOCK) await SDK.paginate(processMercadoLivreOrders);

  // await SDK.paginate(processLojaIntegradaOrders, 1, 50);
  if (UNLOCK) await sendLojaIntegradaOrdersPaginationToQueue();
  await processLojaIntegradaOrdersFromQueue();
};

const processMercadoLivreOrders = async (page: number, limit: number) => {
  const maybeAuthenticated =
    await azureDataTableServices.findOne<BasicPayloadCredentials>({
      partitionKey: process.env.DT_PARTITION_KEY,
    });

  if (!maybeAuthenticated?.rowKey) {
    SDK.logger.error({
      message: `No refresh token found`,
      context: "FETCH_ORDERS",
      data: maybeAuthenticated,
    });

    return SDK.STOP_PAGINATE;
  }

  const {
    rowKey: sellerId,
    RefreshToken,
    AccessToken,
    timestamp,
  } = maybeAuthenticated;

  meliServices.setTokenInCredentials(RefreshToken, AccessToken, timestamp);

  const maybeOrders = await meliServices.findOrders({
    offset: (page - 1) * limit,
    rangeDate: {
      from: new Date("2021-11-05"),
      to: new Date("2021-11-19"),
    },
    sellerId,
  });

  if (maybeOrders.isLeft()) {
    const ordersError = maybeOrders.getLeft();

    SDK.logger.error({
      message: `Error fetching orders ${ordersError.message}`,
      context: "FETCH_ORDERS",
    });

    return SDK.KEEP_PAGINATE;
  }

  const { order_items: orders } = maybeOrders.getRight().data;

  for (const order of orders) {
    console.log(order.item.id);
  }

  return SDK.KEEP_PAGINATE;
};

handler();
