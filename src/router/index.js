import { createRouter, createWebHistory } from 'vue-router'

/**
 * 주소(URL)와 페이지 파일을 연결하는 곳입니다.
 * 새 화면을 만들면:
 * 1) src/views/에 XxxView.vue 추가
 * 2) 아래에 routes 항목 추가
 */
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
      meta: { title: '맛집 목록' },
    },
    {
      path: '/restaurants/:id/edit',
      name: 'restaurant-edit',
      component: () => import('@/views/AddRestaurantView.vue'),
      meta: { title: '맛집 수정' },
    },
    {
      path: '/restaurants/:id',
      name: 'restaurant-detail',
      component: () => import('@/views/RestaurantDetailView.vue'),
      meta: { title: '식당 상세' },
    },
    {
      path: '/filters',
      name: 'filters',
      component: () => import('@/views/FiltersView.vue'),
      meta: { title: '조건 설정' },
    },
    {
      path: '/result',
      name: 'result',
      component: () => import('@/views/PickResultView.vue'),
      meta: { title: '오늘의 추천', hideNav: true, bleed: true },
    },
    {
      path: '/add',
      name: 'add',
      component: () => import('@/views/AddRestaurantView.vue'),
      meta: { title: '맛집 등록' },
    },
    {
      path: '/history',
      name: 'history',
      component: () => import('@/views/HistoryView.vue'),
      meta: { title: '히스토리' },
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/SettingsView.vue'),
      meta: { title: '설정' },
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
