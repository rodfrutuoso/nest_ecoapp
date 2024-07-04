import { BigQuery } from "@google-cloud/bigquery";

export interface UpdateProps<T> {
  data: Partial<T>;
  where: Partial<T>;
}

export class BigQueryMethods<T> {
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

  async select(where: Partial<T> = {}): Promise<T[]> {
    const whereClause = Object.keys(where)
      .map(
        (key) =>
          `${key} = ${
            typeof where[key] === "string" ? `'${where[key]}'` : where[key]
          }`
      )
      .join(" AND ");
    const query = `
      SELECT * FROM \`${this.datasetId_tableId}\`
      ${whereClause ? `WHERE ${whereClause}` : ""}
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
