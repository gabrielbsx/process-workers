import { DevApiSDK } from "@/core/app/devapi-sdk";
import { LojaIntegradaServices } from "../services/loja-integrada.services";

const lojaIntegradaServices = new LojaIntegradaServices();

export const processLojaIntegradaOrdersFromQueue = async () => {
  DevApiSDK.logger.info({
    message: `Processing Loja Integrada Orders`,
    context: "PROCESS_ORDERS",
  });

  const queueKey = `queue:loja-integrada-orders`;

  const ordersFromQueue = await DevApiSDK.queue.peek<
    {
      id: number;
    }[]
  >(queueKey);

  if (!ordersFromQueue) {
    return;
  }

  for (const order of ordersFromQueue) {
    await processLojaIntegradaOrder(order);
  }

  await DevApiSDK.queue.remove(queueKey, ordersFromQueue);

  DevApiSDK.logger.info({
    message: `Processed ${ordersFromQueue.length} orders`,
    context: "PROCESS_ORDERS",
  });

  await processLojaIntegradaOrdersFromQueue();
};

export const sendLojaIntegradaOrdersPaginationToQueue = async (
  page: number = 1,
  limit: number = 50
) => {
  const queueKey = `queue:loja-integrada-orders`;

  const offset = (page - 1) * limit;

  const period = new Date("2024-12-10");

  const maybeOrders = await lojaIntegradaServices.findOrdersByPeriod(
    period,
    offset,
    limit
  );

  if (maybeOrders.isLeft()) {
    const ordersError = maybeOrders.getLeft();

    DevApiSDK.logger.error({
      message: `Error fetching orders ${ordersError.message}`,
      context: "FETCH_ORDERS",
    });

    return;
  }

  const { objects, meta } = maybeOrders.getRight().data;

  await DevApiSDK.queue.enqueue(queueKey, objects);

  const hasNext = meta.total_count > offset + objects.length;

  DevApiSDK.logger.info({
    message: `Enqueued ${objects.length} orders`,
    context: "FETCH_ORDERS",
    data: { page, limit, hasNext, total: meta.total_count },
  });

  if (hasNext) {
    await sendLojaIntegradaOrdersPaginationToQueue(page + 1, limit);
  }
};

const processLojaIntegradaOrder = async (order: { id: number }) => {
  console.log(order?.id);

  if (order.id === 102771053) {
    console.log("Order found");
  }
};

// code snippet to be used in the cache behavior
// const offset = (page - 1) * limit;

// const period = new Date("2024-11-10");
// const periodFormatted = DevApiSDK.formatDate(period, "YYYY-MM-DDTHH:mm:ss");

// const cacheKey = `loja-integrada-orders-${periodFormatted}-${offset}-${limit}`;

// const maybeOrders = await DevApiSDK.cache.execute(
//   cacheKey,
//   () => lojaIntegradaServices.findOrdersByPeriod(period, offset, limit),
//   (response) => response.data.objects
// );
