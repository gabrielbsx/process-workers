import { meliSchema } from "../schema";
import { MercadoLivreIntegration } from "@/core/app/mercado-livre.integration";
import { Either } from "@/core/domain/either";
import { DevApiException } from "@/core/domain/devapi.error";
import { Result } from "@/core/protocols/api.protocol";

type FindOrdersParams = {
  sellerId: string;
  offset: number;
  rangeDate: {
    from: Date;
    to: Date;
  };
};

export class MeliServices extends MercadoLivreIntegration {
  constructor() {
    super();
  }

  async findOrders(params: FindOrdersParams) {
    const maybeIsAuthorized = await this.refreshToken();

    if (maybeIsAuthorized.isLeft()) {
      return Either.left(
        new DevApiException("Mercado Livre Unauthorized")
      ) as Result<never>;
    }

    const currentDate = params.rangeDate.to;
    const fromDate = params.rangeDate.from;

    // 05/11 - 19/11

    const criteria = {
      seller: params.sellerId,
      "order.date_created.from": `${
        fromDate?.toISOString()?.split("T")?.[0]
      }T00:00:00.000-00:00`,
      "order.date_created.to": `${
        currentDate?.toISOString()?.split("T")?.[0]
      }T23:59:59.000-00:00`,
      offset: params.offset,
      sort: "date_asc",
    };

    return meliSchema.ORDERS.findOrdersSearch({
      authorization: this._authorization!,
      params: criteria,
    });
  }
}
