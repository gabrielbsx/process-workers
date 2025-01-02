type LojaIntegradaCredentials = {
  chave_aplicacao: string;
  chave_api: string;
};

export abstract class LojaIntegradaIntegration {
  protected _credentials: LojaIntegradaCredentials;

  protected constructor() {
    this._credentials = {
      chave_aplicacao: process.env.LOJA_INTEGRADA_CHAVE_APLICACAO,
      chave_api: process.env.LOJA_INTEGRADA_CHAVE_API,
    };
  }
}
