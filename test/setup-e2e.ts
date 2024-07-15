import { BigqueryTests } from "bigquery/bigqueryTests";
import { randomUUID } from "crypto";
import "dotenv/config";

const bigqueryTest = new BigqueryTests();
const testDatasetId = randomUUID().toString().slice(0,5);

beforeAll(async () => {
  if (process.env.DATASET_ID_PRODUCTION !== undefined)
    await bigqueryTest.createTestDataset({
      sourceDatasetId: process.env.DATASET_ID_PRODUCTION,
      testDatasetId,
    });
  else {
    throw new Error("Não foi encontrado as variáveis de ambiente");
  }

  process.env.DATASET_ID_PRODUCTION = testDatasetId;
});

afterAll(async () => {
  if (testDatasetId)
    await bigqueryTest.deleteTestDataset(testDatasetId);
  else {
    throw new Error("Não foi encontrado as variáveis de ambiente");
  }
});

// export const setup = async () => {
//   if (
//     process.env.DATASET_ID_PRODUCTION !== undefined &&
//     process.env.DATASET_ID_TEST !== undefined
//   ) {
//     await bigqueryTest.createTestDataset({
//       sourceDatasetId: process.env.DATASET_ID_PRODUCTION,
//       testDatasetId: process.env.DATASET_ID_TEST,
//     });
//   } else {
//     throw new Error("Não foi encontrado as variáveis de ambiente");
//   }

//   process.env.DATASET_ID_PRODUCTION = process.env.DATASET_ID_TEST;
// };

// export const teardown = async () => {
//   if (process.env.DATASET_ID_TEST) {
//     await bigqueryTest.deleteTestDataset(process.env.DATASET_ID_TEST);
//   } else {
//     throw new Error("Não foi encontrado as variáveis de ambiente");
//   }
// };
