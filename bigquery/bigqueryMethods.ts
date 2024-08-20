import { BigQuery } from "@google-cloud/bigquery";
import { NotFoundException } from "@nestjs/common";
import "dotenv/config";

export interface UpdateProps<T> {
  data: Partial<T>;
  where: Partial<T>;
}

export interface SelectOptions<T> {
  where?: Partial<T>;
  greaterOrEqualThan?: Partial<T>;
  lessOrEqualThan?: Partial<T>;
  columns?: (keyof T)[];
  like?: Partial<T>;
  join?: { table: string; on: string };
  distinct?: boolean;
  orderBy?: { column: keyof T; direction: "ASC" | "DESC" };
  groupBy?: (keyof T)[];
  limit?: number;
  offset?: number;
  include?: { [K in keyof T]?: IncludeOptions<T[K]> };
}

export interface IncludeOptions<T> {
  join: { table: string; on: string };
  relationType: "one-to-one" | "one-to-many" | "many-to-many";
}

export class BigQueryMethods<T extends Record<string, any>> {
  private readonly bigquery = new BigQuery({
    keyFilename: "bigquery/bigquery-key-api.json",
    projectId: "ecoeletricatech",
  });

  private readonly datasetId: string;

  constructor(TableId: string) {
    const datasetId = process.env.DATASET_ID_PRODUCTION;
    this.datasetId = datasetId + "." + TableId;
  }

  async runQuery(query: string) {
    console.log(query);
    const options = {
      query,
    };
    const [rows] = await this.bigquery.query(options);
    return rows;
  }

  async create(data: T[]): Promise<{}> {
    if (data.length === 0)
      throw new NotFoundException("Não há dados a serem retornados");

    const fields = Object.keys(data[0])
      .filter((key) => data[0][key] !== undefined)
      .join(", ");
    const values = data
      .map(
        (row) =>
          "(" +
          Object.entries(row)
            .filter(([_, value]) => value !== undefined)
            .map(([_, value]) =>
              typeof value === "string"
                ? `'${value}'`
                : value instanceof Date
                ? `'${value.toISOString()}'` // Converte o Date para o formato ISO 8601 do bigquery
                : value
            )
            .join(", ") +
          ")"
      )
      .join(", ");

    const query = `
      INSERT INTO \`${this.datasetId}\`
      (${fields})
      VALUES
      ${values}
    `;

    return this.runQuery(query);
  }

  async select(options: SelectOptions<T> = {}): Promise<T[]> {
    const {
      where,
      greaterOrEqualThan,
      lessOrEqualThan,
      columns,
      like,
      join,
      distinct,
      orderBy,
      groupBy,
      limit,
      offset,
      include,
    } = options;

    const selectColumns = columns ? columns.join(", ") : "*";
    const distinctClause = distinct ? "DISTINCT" : "";
    const whereClauses: string[] = [];

    if (where) {
      const whereClause = Object.keys(where)
        .filter((key) => where[key] !== undefined)
        .map(
          (key) =>
            `${String(key)} = ${
              typeof where[key] === "string" ? `'${where[key]}'` : where[key]
            }`
        )
        .join(" AND ");
      if (whereClause) whereClauses.push(whereClause);
    }

    if (greaterOrEqualThan) {
      const greaterOrEqualThanClause = Object.keys(greaterOrEqualThan)
        .filter((key) => greaterOrEqualThan[key] !== undefined)
        .map(
          (key) =>
            `${String(key)} >= ${
              typeof greaterOrEqualThan[key] === "string"
                ? `'${greaterOrEqualThan[key]}'`
                : greaterOrEqualThan[key]
            }`
        )
        .join(" AND ");
      if (greaterOrEqualThanClause) whereClauses.push(greaterOrEqualThanClause);
    }

    if (lessOrEqualThan) {
      const lessOrEqualThanClause = Object.keys(lessOrEqualThan)
        .filter((key) => lessOrEqualThan[key] !== undefined)
        .map(
          (key) =>
            `${String(key)} <= ${
              typeof lessOrEqualThan[key] === "string"
                ? `'${lessOrEqualThan[key]}'`
                : lessOrEqualThan[key]
            }`
        )
        .join(" AND ");
      if (lessOrEqualThanClause) whereClauses.push(lessOrEqualThanClause);
    }

    if (like) {
      const likeClause = Object.keys(like)
        .map(
          (key) =>
            `${String(key)} LIKE ${
              typeof like[key] === "string" ? `'%${like[key]}%'` : like[key]
            }`
        )
        .join(" AND ");
      whereClauses.push(likeClause);
    }

    const whereClause =
      whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";
    const joinClause = join
      ? `JOIN \`${this.datasetId.split(".")[0]}.${join.table}\` ON ${join.on}`
      : "";
    const groupByClause = groupBy
      ? `GROUP BY ${groupBy.map((col) => String(col)).join(", ")}`
      : "";
    const orderByClause = orderBy
      ? `ORDER BY ${String(orderBy.column)} ${orderBy.direction}`
      : "";
    const limitClause = limit ? `LIMIT ${limit}` : "";
    const offsetClause = offset ? `OFFSET ${offset}` : "";

    const query = `
      SELECT ${distinctClause} ${selectColumns} FROM \`${this.datasetId}\`
      ${joinClause}
      ${whereClause}
      ${groupByClause}
      ${orderByClause}
      ${limitClause}
      ${offsetClause}
    `;

    let rows = await this.runQuery(query);
    const schema = await this.getTableSchema();
    rows = this.convertRows(rows, schema);

    if (include) {
      rows = await this.selectIncludes(options, rows);
    }

    return rows;
  }

  async update(props: UpdateProps<T>): Promise<{}> {
    const { data, where } = props;
    const setClause = Object.keys(data)
      .map(
        (key) =>
          `${key} = ${
            typeof data[key] === "string" ? `'${data[key]}'` : data[key]
          }`
      )
      .join(", ");
    const whereClause = Object.keys(where)
      .map(
        (key) =>
          `${key} = ${
            typeof where[key] === "string" ? `'${where[key]}'` : where[key]
          }`
      )
      .join(" AND ");
    const query = `
      UPDATE \`${this.datasetId}\`
      SET ${setClause}
      WHERE ${whereClause}
    `;
    return this.runQuery(query);
  }

  async delete(where: Partial<T>): Promise<{}> {
    const whereClause = Object.keys(where)
      .map(
        (key) =>
          `${key} = ${
            typeof where[key] === "string" ? `'${where[key]}'` : where[key]
          }`
      )
      .join(" AND ");
    const query = `
      DELETE FROM \`${this.datasetId}\`
      WHERE ${whereClause}
    `;
    return this.runQuery(query);
  }

  private async getTableSchema() {
    const tableId = this.datasetId.split(".")[1];
    const [metadata] = await this.bigquery
      .dataset(this.datasetId.split(".")[0])
      .table(tableId)
      .getMetadata();
    return metadata.schema.fields;
  }

  private convertRows(rows: any[], schema: any[]): T[] {
    return rows.map((row) => {
      const convertedRow = {} as T;
      for (const field of schema) {
        const fieldName = field.name;
        const fieldType = field.type;

        let value = row[fieldName];

        if (fieldType === "INTEGER") {
          value = parseInt(value, 10);
        } else if (
          fieldType === "FLOAT" ||
          fieldType === "NUMERIC" ||
          fieldType === "BIGNUMERIC"
        ) {
          value = parseFloat(value);
        } else if (
          fieldType === "DATE" ||
          fieldType === "TIMESTAMP" ||
          fieldType === "DATETIME"
        ) {
          value = new Date(value.value); // Acessa o campo "value" do objeto de data retornado pelo BigQuery
        }

        convertedRow[fieldName as keyof T] = value;
      }
      return convertedRow;
    });
  }

  private async selectIncludes(
    options: SelectOptions<T>,
    primaryRows: T[]
  ): Promise<T[]> {
    if (!options.include) return primaryRows;

    for (const [key, includeOptions] of Object.entries(options.include)) {
      if (!includeOptions) continue;

      const includedRows = await this.runIncludeQuery(
        includeOptions,
        primaryRows
      );

      const [primaryTable, primaryKey] = includeOptions.join.on
        .split("=")[0]
        .trim()
        .split(".");
      const [foreignTable, foreignKey] = includeOptions.join.on
        .split("=")[1]
        .trim()
        .split(".");

      if (!primaryKey || !foreignKey) {
        throw new Error(
          "A chave primária ou estrangeira não está definida corretamente."
        );
      }

      if (includeOptions.relationType === "one-to-one") {
        primaryRows = primaryRows.map((row) => {
          const includedRow = includedRows.find(
            (includeRow) => includeRow[foreignKey] === row[primaryKey]
          );
          return {
            ...row,
            [key]: includedRow || null,
          };
        });
      } else {
        primaryRows = primaryRows.map((row) => ({
          ...row,
          [key]: includedRows.filter(
            (includeRow) => includeRow[foreignKey] === row[primaryKey]
          ),
        }));
      }
    }

    return primaryRows;
  }

  private async runIncludeQuery(
    includeOptions: IncludeOptions<any>,
    primaryRows: T[]
  ) {
    const { table, on } = includeOptions.join;

    const [primaryCondition, foreignCondition] = on.split("=");

    const primaryColumn = primaryCondition.trim().split(".")[1];
    const foreignColumn = foreignCondition.trim().split(".")[1];

    const ids = primaryRows.map((row) => row[primaryColumn]).filter(Boolean);

    if (ids.length === 0) {
      return [];
    }

    const fullTableName = `\`${this.datasetId.split(".")[0]}.${table}\``;

    const query = `
  SELECT * FROM ${fullTableName} 
  WHERE ${foreignColumn} IN (${ids.map((id) => `'${id}'`).join(", ")})
  `;

    const rows = await this.runQuery(query);
    return rows;
  }
}
