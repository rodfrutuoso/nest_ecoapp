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
- create regex to register project []
- create 'edited by' and 'edited at' fields on budget entity [x]
- create get project by project_number [x]
- create register budgets []
- create get budgets by project_number []
- create update budget (this use case'll create lines new budgets for that project) []
- create fetch budgets (by list of projects and returning just found projects) []
- create register estimator []
- create update estimator []
- create delete estimator []
- create fetch estimators []
- ajust user controllers to chose use case by type []

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

# Criar novo caso de uso do zero

### Domain

- Criei a entidade no padrão que já existe
- Criei o caso de uso
  - Criei o contrato de repositório com os métodos necessários
  - Criei o InMemory... que é implementação do repositório para teste na camada de domínio
  - Criei os métodos necessários no repositório de teste
- Criei o teste para validar todas as saídas do meu caso de uso

### Infra

- Criei o repositório na camada de infra [aqui](../src/infra/database/bigquery/repositories)
- Caso necessário, criei o schema da tabela [aqui](../src/infra/database/bigquery/schemas/)
  - Adicione o schema no formato do bigquery no [BigqueryShemas](../src/infra/database/bigquery/schemas/bigquery%20schemas/bigquerySchemas.ts) para que o Query builder do Bigquery busque nesse arquivo ao invés de fazer uma requisição.
  - Adicione a nova tabela ao [BigQueryModule](../src/infra/database/bigquery/bigquery.module.ts)
- Crie o mapper daquele repositório para transformar os dados para a da camada de domínio para a infra, e vice-versa.
- Crie o arquivo de controller na sua pasta correspondente [aqui](../src/infra/http/controllers)
- Teste o controller usando a extensão Rest do arquivo [client](../client.http)
  - Criei o DTO (Data Transfer Object) do recebimento de dados daquele controller [aqui](../src/infra/http/swagger%20dto%20and%20decorators/), se houver
  - Crie o Decorator de Response daquele controller [aqui](../src/infra/http/swagger%20dto%20and%20decorators/)
- Crie o teste e2e automatizado daquele controller e já foi.
