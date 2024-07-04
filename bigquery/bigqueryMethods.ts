import { BigQuery } from "@google-cloud/bigquery";


export class BigQueryMethods<T> {
  private readonly bigquery = new BigQuery({
    keyFilename: "bigquery/bigquery-key-api.json",
    projectId: "ecoeletricatech",
  });

  constructor(private readonly datasetId_tableId: string) {}

  protected async runQuery(query: string) {
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
}
