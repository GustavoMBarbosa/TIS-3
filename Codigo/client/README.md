# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

-   [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Tecnologias necessárias

O Node.js é necessário para rodar o projeto

-   Node.js [Link para instalação](https://nodejs.org/en)

## Instruçes para rodar o front end

1. Caso não possua o yarn, instale-o em sua máquina com o comando `npm i -g yarn`
2. Troque para o diretório `Codigo/client`
3. Instale as dependências com o comando `yarn`
4. Crie um arquivo chamado `.env` no diretório `Codigo/client`
5. Copie o conteudo do arquivo `.env.example` para `.env`
6. Inicie o projeto com o comando `yarn dev`

## Como funciona o projeto do front end

O front end está sendo criado utilizando as seguintes tecnologias:

-   [Vue 3](https://v3.vuejs.org/)
-   [Axios](https://axios-http.com/ptbr/docs/intro)
-   [Tailwind CSS](https://tailwindcss.com/)
-   [Scss](https://sass-lang.com/)

### Estrutura dos arquivos

-   Client/src/views: Contém todas as páginas do projeto (Exemplo: [página de perfil](./src/view/perfil/Index.vue))
-   Client/src/components: Contém todos os componentes do projeto. ([Exemplo: Button](./src/components/Button.vue))
-   Client/src/utils: Contém todos os utilitários do projeto
-   Client/src/controller: Contém todos os controladores do projeto, as chamadas ao back são declaradas em forma de função nesse arquivo.([Exemplo: gadoController](./src/controller/gado.js))
-   [Client/src/router](./src/router): Contém todos os rotas do projeto, páginas criadas devem estar linkadas às suas respectivas rotas
