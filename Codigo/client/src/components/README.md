# Componentes
Aqui está documentado o funcionamento dos components do sistema. Abaixo será descrito como chamar suas propriedades
- props
    - Para chamar valores fixos: `nome-da-propriedade="Valor"`
    - Para chamar valores variáveis: `:nome-da-propriedade="Nome da variável ou código"`
    - Para chamar valores verdadeiros: `nome-da-propriedade`
    - Para chamar o model-value: `v-model="variável"`
    - Para chamar o model-value secundários: `v-model:nome-da-propriedade="variável"`
- emits
    - Para chamar as funções do componetes, faça: `@nome-da-função="sua função"`
- slots
    - Para o slot default: <nome-do-component>HTML ou valor desejado</nome-do-component>,
    - Para outros slots: <nome-do-component>
                            <template #nome-do-slot="{ variáveis dele }">
                                HTML ou valor desejado
                            </template> 
                        </nome-do-component>`

Para usar os compoentes, basta importá-los no script e colocá-los no components do Vue. Exemplo:

import Input from '@/components/Input.vue';
export default {
	components: { Input },
}

## Alert
> Função

Para utitlizar o componente alert, basta chamar `this.$alert({props})` passando as propriedades desejadas.

### Props:
- title: string
    - Se essa propriedade for passada, ela será o título do alerta
- message: string
    - Será a mensagem do alerta
- type: 'error' | 'warning' | 'success' | 'info'
    - default: 'error'
    - Determinará a cor do alerta
- top: boolean
    - Se for verdadeira, essa propriedade posiciona o alerta no topo da página
- right: boolean
    - Se for verdadeira, essa propriedade posiciona o alerta na direita da página
- bottom: boolean
    - Se for verdadeira, essa propriedade posiciona o alerta no final da página
- left: boolean
    - Se for verdadeira, essa propriedade posiciona o alerta na esquerda da página
- timeout(ms): int
    - Se essa propriedade for passada, o alerta sumirá, automaticamente, após o tempo passado

## Button
Um botão genérico

### Props:
- variant: 'primary' | 'green' | 'orange'
    -default: 'primary'
    - Será a cor do botão
- size: 'small' | 'medium' | 'large'
    -default: 'medium'
    - Será o tamanho do botão
- only-border: boolean
    - Se for verdadeira, o botão terá o fundo transparent e a borda da cor da 'variant'
- disabled: boolean
    - Se for verdadeira, o click do botão não terá efeito
- rounded: boolean
    - Se for verdadeira, o botão será rodondo

### Emits:
- click
    - Executado quando o botão for clicado

### Slots:
- default

# Card
Um card genérico

### Slots:
- default

# Checkbox

### Props:
- model-value: boolean
    - Sintaxe: `v-model="sua variável"`
    - default: false
    - Determinará se o checkbox está marcado ao não
- disabled: boolean
    - Se for verdadeira, o click no checkbox não terá efeito

### Emits:
- update:model-value
    - Função executada quando o valor do checkbox mudar

### Slots:
- default
    - Será o texto que vai aparecer do lado do checkbox

## Confirm
> Função

O componente 'Confirm' é uma função utilizada para se obter uma resposta de sim ou não do usuário. Para utitlizar o componente, basta chamar `this.$confirm({props})` passando as propriedades desejadas. Como essa função é uma promisse, pode-se o obter a resposta do usuário das seguintes formas.
1. this.$confirm({props})
    .then((resposta) => console.log('O usuário click no botão de confirmar: ', resposta));
2. const resposta = await this.$confirm({props});
   console.log('O usuário click no botão de confirmar: ', resposta);

### Props:
- title: string
    - Se essa propriedade for passada, ela será o título do card
- desciption: string
    - Será a descrição do card
- confirmText: string
    - defautl: 'Confirmar'
    - Será o texto do botão de confirmação
- cancelText: string
    - defautl: 'Cancelar'
    - Será o texto do botão de cancelar

# DatePicker

### Props:
- model-value: Date[] | Date
    - Sintaxe: `v-model="sua variável"`
    - Será a(s) data(s) selecionada(s)
- expanded: boolean
    - Sintaxe: `v-model:expanded="sua variável"`
    - Determinará se o dropdown está fechado
- is-compare: boolean
    - default: false
    - Determinará se usuário poderá clicar em mais de uma data
- max-date: Date
    - Se essa propriedade for passada, será a data máxima que usuário poderá clicar
- min-date: Date
    - Se essa propriedade for passada, será a data mínima que usuário poderá clicar
- label: string
    - Se essa propriedade for passada, será a label em cima do componente

### Emits:
- update:model-value
    - Função executada quando o valor do v-model/model-value mudar
- update:expanded
    - Função executada quando o valor do v-model:expanded/expanded mudar

### Slots:
- default
    - Será o placeholder do dropdown

# Dialog

### Props:
- model-value: any
    - Sintaxe: `v-model="sua variável"`
    - Item selecionado pelo usuário
- width: string
    - default: fit-content
    - Se essa propriedade for passada, será a largura do dialog
- height: string
    - default: fit-content
    - Se essa propriedade for passada, será a largura do dialog
- no-overflow: boolean
    - default: false
    - Determinará dialog terá scroll
- overflow-hidden: boolean
    - default: false
    - Determinará terá o overflow hidden

### Emits:
- update:model-value
    - Função executada quando o valor do v-model/model-value mudar

### Slots:
- default
    - Será o conteúdo do dialog


# Filter
Será o card montado a partir do v-model propercionado

### Props:
- model-value: array
    - Sintaxe: `v-model="sua variável"`
    - Propriedades dos objetos dentro do array:
        - text: string
            - Valor que será exibido para o usuário
        - selected: boolean
            - Determinará se aquela opção estará selecionada
        - childs: array
            - Se seu texto tiver várias opções para selecionar, elas deverão ser passados na prop childs, com os mesmo atributos descritos a cima

### Emits:
- update:model-value
    - Função executada quando o valor do v-model/model-value mudar


# Icon
Os ícones são tirados da biblioteca do (Material Icons)[https://fonts.google.com/icons]. Para encontrar o nome do ícone escolhe pegue o valor dentro do span na seção `Inserting the icon`.
Mudar a cor: `color: cor`
Mudar o tamanho: `font-size: tamanho`

### Props:
- name: string
    - Será o nome do ícone tirado do `Material Icons` na seção `Inserting the icon`

# Input

### Props:
- model-value: string | number
    - Sintaxe: `v-model="sua variável"`
    - Determinará o valor do input
- type: 'text' | 'number' | 'search' | 'password' | 'email'
    - default: 'text'
    - Será o tipo do input
- disabled: boolean
    - Se for verdadeira, o usuário não poderá digitar no input
- label: string
    - Se essa propriedade for passada, será a label em cima do componente
- placeholder: string
    - Se essa propriedade for passada, será o placeholder do input
- is-error: string
    - Se for verdadeira, o input terá o estilo de error
- error-message: string
    - Se a propriedade is-error for verdadeira, essa string aparecerá em baixo do input
- text-area: boolean
    - Se for verdadeira, o input será um text-area

### Emits:
- update:model-value
    - Função executada quando o valor do v-model/model-value mudar
- blur
    - Função executada quando o input sair de foco

# Notification

### Props:
- items: array
    - default: []
    - Será a lista contendo as notificações

### Slots:
- empty-state
    - Será exibido se a propriedade 'items' for uma lista vazia
- item
    - Será o modelo html para todas as notificações
    - Propriedades:
        - item: item da sua lista
        - index: posição do item

# Select

### Props:
- model-value: boolean
    - Sintaxe: `v-model="sua variável"`
    - Determinará se o dialog estará aberto
- items: array
    - default: []
    - Serão das opções do select
- expanded: boolean
    - Sintaxe: `v-model:expanded="sua variável"`
    - Determinará se o dropdown está fechado
- label: string
    - Se essa propriedade for passada, será a label em cima do componente
- labelKey: string
    - default: 'label'
    - Se seus itens forem objetos, essa propriedade determinará qual valor será exibido como opção

### Emits:
- update:model-value
    - Função executada quando o valor do v-model/model-value mudar
- update:expanded
    - Função executada quando o valor do v-model:expanded/expanded mudar

### Slots:
- default
    - Será o placeholder do dropdown


# Tab

### Props:
- model-value: number
    - Sintaxe: `v-model="sua variável"`
    - Será o index da aba selecionada
- items: array
    - default: []
    - Serão das opções de abas
    - Pode se passar um array de string ou de objetos contendo `{text: nome da aba, icon: ícone da aba, opcional}`
- disabled: boolean
    - Se for verdadeira, o usuário não poderá mudar de aba

### Emits:
- update:model-value
    - Função executada quando o valor do v-model/model-value mudar

# Table

### Props:
- headers: array
    - Determinará valores do header da tabela
    - Propriedades dos objetos dentro do array:
        - text: string
            - Valor que será exibido para o usuário
        - value: string
            - Valor usado para ordenar a tabela e para determinar os slots
        - sortable: boolean
            - Determinará se a tabele vai poder ser ordenada por essa coluna
        - width: string
            - default: fit-content
            - Determinará o tamanho da coluna
        - align: string
            - default: flex-start
            - Determinará onde o texto da coluna ficará
- items: array
    - default: []
    - Serão das opções do select
- max-height: string
    - default: '50vh'
    - Determinará a altura máxima da sua tabela
- options: object
    - Se essa propriedade for passada, ela será as opções iniciais de sort da tabela
    - Propriedades dos objeto:
        - sortBy: string
            - Valor equivalente do header (coluna da tabela)
        - isDesc: boolean
            - Determinará se a coluna vai ser ordenada de maneira decrescente
- loading: boolean
    - default: false
    - Se essa propriedade for verdadeira, a tabela terá skeletons para simular o carregamento

### Emits:
- update:model-value
    - Função executada quando o valor do v-model/model-value mudar
- update:expanded
    - Função executada quando o valor do v-model:expanded/expanded mudar

### Slots:
- empty-state
    - Será exibido se a propriedade 'items' for uma lista vazia
- header:value
    - Para cada valor que está na propriedade headers, deve-se ter um slot correspondente
    - Propriedades:
        - item: item da sua lista
        - index: posição do item
- actions
    - Será as ações da table
    - Propriedades:
        - item: item da sua lista
        - index: posição do item
- childs
    - Se quiser que os itens da sua table tenham filhos, só colocar esse slot. Quando item.expanded = true, esse html aparecerá 
    - Propriedades:
        - item: item da sua lista
        - index: posição do item


# Tag

### Props:
- text: string
    - Será o texto dentro da tag
- color: 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'gray'
    - default: blue
    - Será a cor da tag

### Slots:
- default
    - Quando nenhum texto é informado, o slot default será exibido