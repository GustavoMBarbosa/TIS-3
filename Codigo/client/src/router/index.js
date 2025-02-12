import { createRouter, createWebHistory } from 'vue-router';
import lucroController from '@/controller/profit.js';
import maoDeObraController from '@/controller/mao-de-obra.js';
import despesaController from '@/controller/cost.js';
import animalController from '@/controller/animal.js';
import { COST_FIELDS, PROFIT_FIELDS, COW_FIELDS, WORKER_FIELDS } from './fields.js';
import Auth0 from '../auth/index.js';

const routes = [
    {
        path: '/perfil',
        alias: '/',
        name: 'Perfil',
        props: true,
        component: () => import('@/view/perfil/Index.vue'),
        beforeEnter: Auth0.routeGuard
    },
    {
        path: '/gado',
        name: 'Gado',
        props: true,
        component: () => import('@/view/gado/Index.vue'),
        beforeEnter: Auth0.routeGuard
    },
    {
        path: '/gado/vaca',
        name: 'CriarVaca',
        props: {
            value: 'vaca',
            fields: COW_FIELDS,
            callback: animalController.createAnimal,
            import: animalController.importFile,
            returnTo: '/gado',
        },
        component: () => import('@/components/CreateEdit.vue'),
        beforeEnter: Auth0.routeGuard
    },
    {
        path: '/gado/vaca/:id',
        name: 'EditarVaca',
        props: route => ({
            id: route.params.id,
            value: 'vaca',
            fields: COW_FIELDS,
            callback: animalController.updateAnimal,
            get: animalController.getAnimal,
            returnTo: '/gado',
        }),
        component: () => import('@/components/CreateEdit.vue'),
        beforeEnter: Auth0.routeGuard
    },
    {
        path: '/financas',
        name: 'Finanças',
        props: true,
        component: () => import('@/view/financas/Index.vue'),
        beforeEnter: Auth0.routeGuard
    },
    {
        path: '/financas/despesa/:id',
        name: 'DespesaEditar',
        props: route => ({
            id: route.params.id,
            value: 'despesa',
            fields: COST_FIELDS,
            callback: despesaController.updateCost,
            get: despesaController.getCost,
            returnTo: '/financas',
        }),
        component: () => import('@/components/CreateEdit.vue'),
        beforeEnter: Auth0.routeGuard
    },
    {
        path: '/financas/despesa',
        name: 'DespesaCriar',
        props: {
            value: 'despesa',
            fields: COST_FIELDS,
            callback: despesaController.createCost,
            import: despesaController.importFile,
            returnTo: '/financas',
        },
        component: () => import('@/components/CreateEdit.vue'),
        beforeEnter: Auth0.routeGuard
    },
    {
        path: '/financas/receita/:id',
        name: 'ReceitaEditar',
        props: route => ({
            id: route.params.id,
            value: 'receita',
            fields: PROFIT_FIELDS,
            callback: lucroController.updateProfit,
            get: lucroController.getProfit,
            returnTo: '/financas',
        }),
        component: () => import('@/components/CreateEdit.vue'),
        beforeEnter: Auth0.routeGuard
    },
    {
        path: '/financas/receita',
        name: 'ReceitaCriar',
        props: {
            value: 'receita',
            fields: PROFIT_FIELDS,
            callback: lucroController.createProfit,
            import: lucroController.importFile,
            returnTo: '/financas',
        },
        component: () => import('@/components/CreateEdit.vue'),
        beforeEnter: Auth0.routeGuard
    },
    {
        path: '/mao-de-obra',
        name: 'MaoDeObra',
        props: true,
        component: () => import('@/view/mao-de-obra/Index.vue'),
        beforeEnter: Auth0.routeGuard
    },
    {
        path: '/mao-de-obra/criar',
        name: 'MaoDeObrasCriar',
        props: {
            value: 'Mão de Obra',
            fields: WORKER_FIELDS,
            callback: maoDeObraController.createMaoDeObra,
            import: maoDeObraController.importFile,
            returnTo: '/mao-de-obra',
        },
        component: () => import('@/components/CreateEdit.vue'),
        beforeEnter: Auth0.routeGuard
    },
    {
        path: '/mao-de-obra/:id',
        name: 'MaoDeObraEditar',
        props: route => ({
            id: route.params.id,
            value: 'Mão de Obra',
            fields: WORKER_FIELDS,
            callback: maoDeObraController.updateMaoDeObra,
            get: maoDeObraController.getMaoDeObra,
            returnTo: '/mao-de-obra',
        }),
        component: () => import('@/components/CreateEdit.vue'),
        beforeEnter: Auth0.routeGuard
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;