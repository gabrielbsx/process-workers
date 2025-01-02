import { DevApiSDK } from "@/core/app/devapi-sdk";
import { LojaIntegradaIntegration } from "@/core/app/loja-integrada.integration";
import { lojaIntegradaSchema } from "../schema";
import { Result } from "@/core/protocols/api.protocol";

type FindOrdersByPeriod = {
  objects: {
    id: string;
  }[];
  meta: {
    total: number;
    limit: number;
    offset: number;
    previous: string;
    next: string;
    total_count: number;
  };
};

export class LojaIntegradaServices extends LojaIntegradaIntegration {
  constructor() {
    super();
  }

  async findOrdersByPeriod(
    period: Date,
    offset = 0,
    limit = 50
  ): Promise<Result<FindOrdersByPeriod>> {
    const createdDate = DevApiSDK.formatDate(period, "YYYY-MM-DDTHH:mm:ss");

    const response = (await lojaIntegradaSchema.PEDIDO.findPedidoSearch({
      ...this._credentials,
      params: {
        since_criado: createdDate,
        offset,
        limit,
      },
    })) as Result<FindOrdersByPeriod>;

    if (response.isLeft()) {
      const error = response.getLeft();

      DevApiSDK.logger.error({
        message: `Error fetching orders ${error.message}`,
        context: "FETCH_ORDERS",
      });

      return response;
    }

    return response;
  }
}
