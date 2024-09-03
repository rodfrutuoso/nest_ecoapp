# Technical debt
- Create a away to migrate the scheamas of "/src/infra/database/bigquery/schemas" from files to tables on bigquery
- Verify if DDD errors are comunicating to nest excepetion errors [x]
- budget fetch use cases needs contractId on search []
- transfer-material needs verification if parameters exists [x]
- ajust history movimentation fetch [x]
- ajust user fetch [x]
- put controller classes on another archive 
- refact storekeeper and estimator use cases to include mother class user and auth by it


# Order
- Repositories
- mappers
- controllers

# Test 1 file
- pnpm vitest run .\src\infra\http\controllers\get-account-by-id.controller.e2e-spec.ts --config ./vitest.config.e2e.ts 

# Compodoc
- npx @compodoc/compodoc -p tsconfig.json -s