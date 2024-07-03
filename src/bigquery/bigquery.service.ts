import { Injectable } from "@nestjs/common";
import { BigQuery } from "@google-cloud/bigquery";

@Injectable()
export class BigQueryService {
  private readonly bigquery = new BigQuery({
    keyFilename: "bigquery/bigquery-key-api.json",
    projectId: "ecoeletricatech",
  });

  async runQuery(query: string) {
    const options = {
      query,
    };
    const [rows] = await this.bigquery.query(options);
    return rows;
  }
}
