import { SDK } from "@/core/app/sdk";
import { LojaIntegradaIntegration } from "@/core/app/loja-integrada.integration";
import { lojaIntegradaSchema } from "../schema";

export class LojaIntegradaServices extends LojaIntegradaIntegration {
  constructor() {
    super();
  }

  async findOrdersByPeriod(period: Date, offset = 0, limit = 50) {
    const createdDate = SDK.formatDate(period, "YYYY-MM-DDTHH:mm:ss");

    const response = await lojaIntegradaSchema.PEDIDO.findPedidoSearch({
      ...this._credentials,
      params: {
        since_criado: createdDate,
        offset,
        limit,
      },
    });

    if (response.isLeft()) {
      const error = response.getLeft();

      SDK.logger.error({
        message: `Error fetching orders ${error.message}`,
        context: "FETCH_ORDERS",
      });

      return response;
    }

    return response;
  }
}
