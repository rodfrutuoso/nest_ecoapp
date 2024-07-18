import { BigQuery } from "@google-cloud/bigquery";
import { NotFoundException } from "@nestjs/common";
import "dotenv/config";

export interface UpdateProps<T> {
  data: Partial<T>;
  where: Partial<T>;
}

export interface SelectOptions<T> {
  where?: Partial<T>;
  columns?: (keyof T)[];
  like?: Partial<T>;
  join?: { table: string; on: string };
  distinct?: boolean;
  orderBy?: { column: keyof T; direction: "ASC" | "DESC" };
  groupBy?: (keyof T)[];
  limit?: number;
  offset?: number;
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
    const options = {
      query,
    };
    const [rows] = await this.bigquery.query(options);
    return rows;
  }

  async create(data: T[]): Promise<{}> {
    if (data.length === 0)
      throw new NotFoundException("Não há dados a serem retornados");

    const fields = Object.keys(data[0]).join(", ");
    const values = data
      .map(
        (row) =>
          "(" +
          Object.values(row)
            .map((value) => (typeof value === "string" ? `'${value}'` : value))
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
      columns,
      like,
      join,
      distinct,
      orderBy,
      groupBy,
      limit,
      offset,
    } = options;

    const selectColumns = columns ? columns.join(", ") : "*";
    const distinctClause = distinct ? "DISTINCT" : "";
    const whereClauses: string[] = [];

    if (where) {
      const whereClause = Object.keys(where)
        .map(
          (key) =>
            `${String(key)} = ${
              typeof where[key] === "string" ? `'${where[key]}'` : where[key]
            }`
        )
        .join(" AND ");
      whereClauses.push(whereClause);
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
    const joinClause = join ? `JOIN ${join.table} ON ${join.on}` : "";
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

    const rows = await this.runQuery(query);
    const schema = await this.getTableSchema();

    return this.convertRows(rows, schema);
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
        } else if (fieldType === "BOOLEAN") {
          value = value === "true";
        }

        convertedRow[fieldName as keyof T] = value;
      }
      return convertedRow;
    });
  }
}
