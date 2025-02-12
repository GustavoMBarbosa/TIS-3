# Awesome Project Build with TypeORM

Steps to run this project:

1. Run `yarn` command
2. Setup database settings inside `data-source.ts` file
3. Run `yarn start` command

## Migrations

-   Execute o comando `yarn migration:create 'src/migration/<name>'` para criar uma nova migração
-   Execute o comando `yarn migration:run` to run all migrations
-   Execute o comando `yarn migration:revert` to revert the last migration
