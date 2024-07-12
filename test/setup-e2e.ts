import { BigqueryTests } from "bigquery/bigqueryTests";
import "dotenv/config";

const bigqueryTest = new BigqueryTests();

beforeAll(async () => {
  if (
    process.env.DATASET_ID_PRODUCTION !== undefined &&
    process.env.DATASET_ID_TEST !== undefined
  )
    await bigqueryTest.createTestDataset({
      sourceDatasetId: process.env.DATASET_ID_PRODUCTION,
      testDatasetId: process.env.DATASET_ID_TEST,
    });
  else {
    throw new Error("Não foi encontrado as variáveis de ambiente");
  }

  process.env.DATASET_ID_PRODUCTION = process.env.DATASET_ID_TEST;
});

afterAll(async () => {
  if (process.env.DATASET_ID_TEST)
    await bigqueryTest.deleteTestDataset(process.env.DATASET_ID_TEST);
  else {
    throw new Error("Não foi encontrado as variáveis de ambiente");
  }
});
