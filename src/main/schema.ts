import { SDK } from "@/core/app/sdk";
import {
  OrderBillingType,
  OrderPackType,
  OrdersSearchType,
  RefreshTokenType,
  ShipmentsType,
  UsersType,
} from "./schemas/mercado-livre.types";

export const meliSchema = {
  AUTHENTICATION: {
    refreshToken: async ({
      grant_type,
      client_id,
      client_secret,
      refresh_token,
    }: {
      grant_type: string;
      client_id: string;
      client_secret: string;
      refresh_token: string;
    }) => {
      return SDK.api.post<RefreshTokenType>({
        url: "https://api.mercadolibre.com/oauth/token",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: {
          grant_type,
          client_id,
          client_secret,
          refresh_token,
        },
      });
    },
  },
  ORDERS: {
    findOrdersSearch: async ({
      authorization,
      params,
    }: {
      authorization: string;
      params: Record<string, unknown>;
    }) => {
      return SDK.api.get<OrdersSearchType>({
        url: "https://api.mercadolibre.com/orders/search",
        headers: {
          Authorization: authorization,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        params,
      });
    },
    findOrderBillingById: async ({
      id,
      authorization,
    }: {
      id: string;
      authorization: string;
    }) => {
      return SDK.api.get<OrderBillingType>({
        url: `https://api.mercadolibre.com/orders/${id}/billing_info`,
        headers: {
          Authorization: authorization,
          "Content-Type": "application/json",
        },
      });
    },
    findOrderById: async ({
      id,
      authorization,
    }: {
      id: string;
      authorization: string;
    }) => {
      return SDK.api.get<OrdersSearchType>({
        url: `https://api.mercadolibre.com/orders/${id}`,
        headers: {
          Authorization: authorization,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
    },
    findOrderPackById: async ({
      id,
      authorization,
    }: {
      id: string;
      authorization: string;
    }) => {
      return SDK.api.get<OrderPackType>({
        url: `https://api.mercadolibre.com/packs/${id}`,
        headers: {
          Authorization: authorization,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
    },
  },
  CUSTOMERS: {
    findCustomerById: async ({
      authorization,
      id,
    }: {
      authorization: string;
      id: string;
    }) => {
      return SDK.api.get<UsersType>({
        url: `https://api.mercadolibre.com/users/${id}`,
        headers: {
          Authorization: authorization,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
    },
  },
  SHIPPING: {
    findShippingDetails: async ({
      shippingId,
      authorization,
    }: {
      shippingId: string;
      authorization: string;
    }) => {
      return SDK.api.get<ShipmentsType>({
        url: `https://api.mercadolibre.com/shipments/${shippingId}`,
        headers: {
          Authorization: authorization,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
    },
  },
};

export const lojaIntegradaSchema = {
  PEDIDO: {
    findPedidoSearch: async ({
      chave_aplicacao,
      chave_api,
      params,
    }: {
      chave_aplicacao: string;
      chave_api: string;
      params: Record<string, unknown>;
    }) => {
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

      return SDK.api.get<FindOrdersByPeriod>({
        url: `https://api.awsli.com.br/v1/pedido/search`,
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        params: {
          chave_aplicacao,
          chave_api,
          format: "json",
          ...params,
        },
      });
    },
    findPedido: async ({
      chave_aplicacao,
      chave_api,
      id,
    }: {
      chave_aplicacao: string;
      chave_api: string;
      id: string;
    }) => {
      return SDK.api.get({
        url: `https://api.awsli.com.br/v1/pedido/${id}`,
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        params: {
          chave_aplicacao,
          chave_api,
          format: "json",
        },
      });
    },
    findPedidoStatus: async ({
      chave_aplicacao,
      chave_api,
      id,
    }: {
      chave_aplicacao: string;
      chave_api: string;
      id: string;
    }) => {
      return SDK.api.get({
        url: `https://api.awsli.com.br/v1/situacao/pedido/${id}`,
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        params: {
          chave_aplicacao,
          chave_api,
        },
      });
    },
  },
};
