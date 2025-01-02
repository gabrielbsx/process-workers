declare global {
  declare namespace NodeJS {
    interface ProcessEnv {
      RUNNER: boolean;
      AzureWebJobsDisableHomepage: boolean;
      COMPANY_ID: string;
      TENANT_ID: string;
      PROJECT_ID: string;
      LOG_TYPE: string;
      API_URL: string;
      LOG_ID: string;
      DT_TABLE: string;
      DT_PARTITION_KEY: string;
      SQLSERVER_NAME: string;
      SQLSERVER_USER: string;
      SQLSERVER_PASS: string;
      SQLSERVER_DB: string;
      MELI_CLIENT_ID: string;
      MELI_CLIENT_SECRET: string;
      DB_ACCOUNT: string;
      DB_ACCOUNT_KEY: string;
      DB_CONNECTION_URL: string;
      "ATM-ORDERSMELIATSQLSERVER": string;
      LOJA_INTEGRADA_CHAVE_APLICACAO: string;
      LOJA_INTEGRADA_CHAVE_API: string;
    }
  }
}

export {};
