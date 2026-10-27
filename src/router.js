import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/', name: 'home', component: () => import('@/views/HomeView.vue') },
  { path: '/posts', name: 'posts', component: () => import('@/views/PostsView.vue') },
  { path: '/posts/:slug', name: 'post', component: () => import('@/views/PostView.vue') },
  {
    path: '/categories/skill',
    name: 'skill-archive',
    component: () => import('@/views/SkillCategoryView.vue'),
  },
  { path: '/categories/:slug', name: 'category', component: () => import('@/views/CategoryView.vue') },
  { path: '/tags/:slug', name: 'tag', component: () => import('@/views/TagView.vue') },
  { path: '/projects', name: 'projects', component: () => import('@/views/ProjectsView.vue') },
  { path: '/projects/:slug', name: 'project', component: () => import('@/views/ProjectView.vue') },
  { path: '/lab', name: 'lab', component: () => import('@/views/LabView.vue') },
  { path: '/about', name: 'about', component: () => import('@/views/AboutView.vue') },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.hash) {
      let hash = to.hash;
      try {
        hash = decodeURIComponent(hash);
      } catch (error) {
        // Keep the original hash when decoding fails.
      }
      const targetId = hash.replace(/^#/, '');
      return new Promise((resolve) => {
        const started = Date.now();
        const locate = () => {
          const element = document.getElementById(targetId);
          if (element) {
            resolve({ el: element, top: 96, behavior: 'smooth' });
            return;
          }
          // The route transition mounts the next view after its leave phase.
          if (Date.now() - started > 1200) {
            resolve({ top: 0 });
            return;
          }
          window.requestAnimationFrame(locate);
        };
        locate();
      });
    }
    if (to.path === from.path) return false;
    return { top: 0 };
  },
});

export default router;
