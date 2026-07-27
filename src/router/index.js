import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { title: '오늘 뭐 먹지?' },
    },
    {
      path: '/restaurants',
      name: 'restaurants',
      component: () => import('@/views/RestaurantsView.vue'),
      meta: { title: '식당 목록' },
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.afterEach((to) => {
  const pageTitle = to.meta.title
  document.title = pageTitle ? `${pageTitle} · LunchPicker` : 'LunchPicker'
})

export default router
