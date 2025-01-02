import {
  TableClient,
  odata,
  AzureNamedKeyCredential,
  TableEntity,
} from "@azure/data-tables";
import { Either } from "../domain/either";

type AzureDataTableCredentials = {
  account: string;
  accountKey: string;
  url: string;
  table: string;
};

export type BasicPayload = {
  rowKey: string;
  partitionKey: string;
  timestamp: string;
};

export type BasicPayloadCredentials = {
  RefreshToken: string;
  AccessToken: string;
} & BasicPayload;

export class AzureDataTableIntegration {
  private connection: TableClient | null = null;

  constructor(protected credentials: AzureDataTableCredentials) {}

  async openConnection() {
    if (!this.connection) {
      const sharedKeyCredential = new AzureNamedKeyCredential(
        this.credentials.account,
        this.credentials.accountKey
      );

      this.connection = new TableClient(
        this.credentials.url,
        this.credentials.table,
        sharedKeyCredential
      );
    }
  }

  buildFilter(partitionKey: string, params: Record<string, unknown>) {
    const filters = [
      `PartitionKey eq '${partitionKey}'`,
      ...Object.entries(params).map(([key, value]) => {
        const formattedValue = typeof value === "string" ? `'${value}'` : value;
        return `${key} eq ${formattedValue}`;
      }),
    ];

    return filters.join(" and ");
  }

  async queryEntities<T>(filter: TemplateStringsArray): Promise<T[]> {
    await this.openConnection();

    const entities = [];

    const iterable = this.connection!.listEntities({
      queryOptions: { filter: odata(filter) },
    });

    for await (const entity of iterable) {
      entities.push(entity);
    }

    return entities as T[];
  }

  async find(params: Record<string, unknown>) {
    const partitionKey = params.partitionKey;

    delete params.partitionKey;

    const filter = partitionKey
      ? (this.buildFilter(
          partitionKey as string,
          params
        ) as unknown as TemplateStringsArray)
      : ("" as unknown as TemplateStringsArray);

    return await Either.handle(() => this.queryEntities(filter));
  }

  async findOne<T>(params = {}) {
    const results = await this.find(params);

    if (results.isLeft()) {
      return null;
    }

    const rightResult = results.getRight() as unknown as unknown[] | null;

    return rightResult ? (rightResult[rightResult.length - 1] as T) : null;
  }

  async insert<T extends object>(entity: TableEntity<T>) {
    return this.safeExecute(() => this.connection!.createEntity(entity));
  }

  async upsert<T extends object>(entity: TableEntity<T>) {
    return this.safeExecute(() => this.connection!.upsertEntity(entity));
  }

  async update<T extends object>(entity: TableEntity<T>) {
    return this.safeExecute(() => this.connection!.updateEntity(entity));
  }

  async delete(partitionKey: string, rowKey: string) {
    return this.safeExecute(() =>
      this.connection!.deleteEntity(partitionKey, rowKey)
    );
  }

  async safeExecute(action: () => Promise<unknown>) {
    await this.openConnection();
    return await Either.handle(action);
  }
}
