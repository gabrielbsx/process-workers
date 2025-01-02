import { meliSchema } from "@/main/schema";
import { Either } from "../domain/either";

type Credentials = {
  client_id: string;
  client_secret: string;
  refresh_token?: string;
  timestamp?: string;
};

export abstract class MercadoLivreIntegration {
  protected _credentials: Credentials;
  protected _authorization?: string;

  protected constructor() {
    this._credentials = {
      client_id: process.env.MELI_CLIENT_ID,
      client_secret: process.env.MELI_CLIENT_SECRET,
    };
  }

  setTokenInCredentials(
    refreshToken: string,
    accessToken: string,
    timestamp: string
  ) {
    this._credentials = {
      ...this._credentials,
      refresh_token: refreshToken,
      timestamp,
    };

    this._authorization = `Bearer ${accessToken}`;
  }

  async refreshToken() {
    if (!this.isTokenExpired()) {
      return Either.right(null);
    }

    const response = await meliSchema.AUTHENTICATION.refreshToken({
      grant_type: "refresh_token",
      client_id: this._credentials.client_id,
      client_secret: this._credentials.client_secret,
      refresh_token: this._credentials.refresh_token || "",
    });

    if (response.isLeft()) {
      return response;
    }

    const { data } = response.getRight();

    this._authorization = `Bearer ${data.access_token}`;

    this._credentials = {
      ...this._credentials,
      refresh_token: data.refresh_token,
    };

    return response;
  }

  isTokenExpired() {
    const timestamp = this._credentials.timestamp!;

    const expirationTime = 5 * 60 * 60 * 1000;

    const isExpired =
      Date.now() - new Date(timestamp).getTime() > expirationTime;

    return isExpired;
  }
}
