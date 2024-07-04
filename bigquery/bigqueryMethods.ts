import { BigQuery } from "@google-cloud/bigquery";

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
}

export class BigQueryMethods<T> {
  id: string;
  private readonly bigquery = new BigQuery({
    keyFilename: "bigquery/bigquery-key-api.json",
    projectId: "ecoeletricatech",
  });

  constructor(private readonly datasetId_tableId: string) {}

  async runQuery(query: string) {
    const options = {
      query,
    };
    const [rows] = await this.bigquery.query(options);
    return rows;
  }

  async create(data: T[]): Promise<{}> {
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
      INSERT INTO \`${this.datasetId_tableId}\`
      (${fields})
      VALUES
      ${values}
    `;

    return this.runQuery(query);
  }

  async select(options: SelectOptions<T> = {}): Promise<T[]> {
    const { where, columns, like, join, distinct, orderBy, groupBy } = options;

    const selectColumns = columns ? columns.join(", ") : "*";
    const distinctClause = distinct ? "DISTINCT" : "";
    const whereClauses = [];

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

    const query = `
      SELECT ${distinctClause} ${selectColumns} FROM \`${this.datasetId_tableId}\`
      ${joinClause}
      ${whereClause}
      ${groupByClause}
      ${orderByClause}
    `;

    return this.runQuery(query);
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
      UPDATE \`${this.datasetId_tableId}\`
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
      DELETE FROM \`${this.datasetId_tableId}\`
      WHERE ${whereClause}
    `;
    return this.runQuery(query);
  }
}
