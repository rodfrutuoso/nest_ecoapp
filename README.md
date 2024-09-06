# Nest EcoApp

## Descrição
Nest EcoApp é uma aplicação backend desenvolvida com NestJS para gerenciar operações relacionadas a almoxarifados e orçamentos. O projeto utiliza TypeScript e integra-se com o Google BigQuery para armazenamento e recuperação de dados.

## Funcionalidades Principais
- Autenticação de usuários (Almoxarifes e Orçamentistas)
- Gerenciamento de bases
- Controle de contratos
- Gerenciamento de equipamentos
- Operações de almoxarifado
- Sistema de orçamentos

## Pré-requisitos
- Node.js (versão 14 ou superior)
- npm ou yarn
- Conta Google Cloud com BigQuery configurado

## Instalação

1. Clone o repositório:git clone https://github.com/rodfrutuoso/nest_ecoapp.git
2. Navegue até o diretório do projeto:
cd nest_ecoapp
3. Instale as dependências:
npm installou
yarn install
4. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis:
BIGQUERY_PROJECT_ID=seu_project_id
BIGQUERY_PRIVATE_KEY=sua_private_key
BIGQUERY_CLIENT_EMAIL=seu_client_email
DATASET_ID_PRODUCTION=seu_dataset_id
## Executando a aplicação

Para iniciar a aplicação em modo de desenvolvimento:
npm run start:dev ou
yarn start:dev
## Estrutura do Projeto
```plaintext
src/
├── app/
│   ├── controllers/
│   ├── dtos/
│   ├── entities/
│   ├── errors/
│   ├── repositories/
│   └── use-cases/
├── config/
├── infra/
│   ├── database/
│   └── http/
└── main.ts
```
## Testes
Para executar os testes:
npm run testou
yarn test
## Contribuindo
Contribuições são bem-vindas! Por favor, leia o arquivo CONTRIBUTING.md para detalhes sobre nosso código de conduta e o processo para enviar pull requests.

## Licença
Este projeto está licenciado sob a [Licença MIT](LICENSE).

## Contato
Rodrigo Frutuoso - [GitHub](https://github.com/rodfrutuoso)

Link do Projeto: [https://github.com/rodfrutuoso/nest_ecoapp](https://github.com/rodfrutuoso/nest_ecoapp)