# Technical debt
- Create a away to migrate the scheamas of "/src/infra/database/bigquery/schemas" from files to tables on bigquery
- Verify if DDD errors are comunicating to nest excepetion errors [x]
- budget fetch use cases needs contractId on search [X]
- transfer-material needs verification if parameters exists [x]
- ajust history movimentation fetch [x]
- ajust user fetch [x]
- put controller classes on another archive [x]
- refact storekeeper and estimator use cases to include mother class user and auth by it [x]
- in fecth materials extrect contractId by the accessToken [x]


# Order
- Repositories
- mappers
- controllers

# Test 1 file
- pnpm vitest run .\src\infra\http\controllers\get-account-by-id.controller.e2e-spec.ts --config ./vitest.config.e2e.ts 


# Casos de uso para orçamento
- o orçamentista irá inserir dados dos orçamentos das obras
- para inserir o orçamento, é preciso verificar se o projeto existe.
- o orçamento inserido deverá ser verificado se há itens repetidos
- é preciso poderem corrigir os orçamentos e registrar essa modificação
- é preciso poder consultar projetos em massa
- os dados consultados em massa precisam sinalizar quais obras foram encontradas ou não
- esses dados consultados devem poder ser extraídos por EXCEL
- o orçamentista irá excluir orçamentos
