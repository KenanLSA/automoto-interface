import Layout from '@/layouts/layout.vue'
import Login from '@/pages/auth/login.vue'
import Home from '@/pages/home.vue'
import Products from '@/pages/products.vue'
import Transactions from '@/pages/transactions.vue'
import useAuthStore from '@/stores/authStore'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: Login,
      name: 'login',
      meta: {
        loginRequired: false,
      },
    },
    {
      path: '',
      component: Layout,
      children: [
        {
          path: '',
          component: Home,
          name: 'index',
          meta: {
            loginRequired: true,
          },
        },
        {
          path: '/products',
          component: Products,
          name: 'products',
          meta: {
            loginRequired: true,
          },
        },
        {
          path: '/transactions',
          component: Transactions,
          name: 'transactions',
          meta: {
            loginRequired: true,
          },
        },
      ],
    },
  ],
})

// route auth guard
router.beforeEach(async (to) => {
  const { accessToken, tryRestoreSession } = useAuthStore()

  await tryRestoreSession()

  if (to.meta.loginRequired && !accessToken)
    router.push({ name: 'login', query: { _next: to.path } })

  if (to.name === 'login' && accessToken) {
    return { path: (to.query._next as string) || '/' }
  }
})

export default router
