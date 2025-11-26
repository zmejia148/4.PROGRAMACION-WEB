import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import HomeView from '../views/HomeView.vue'
import ProductsView from '../views/ProductsView.vue'
import ProductCreateView from '../views/ProductCreateView.vue'
import ProductEditView from '../views/ProductEditView.vue'
import ChatView from '../views/ChatView.vue'
import AdminUser from "../views/AdminUsersView.vue"

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginView, meta: { requiresGuest: true } },
  { path: '/register', component: RegisterView, meta: { requiresGuest: true } },
  {
    path: '/home',
    component: HomeView,
    meta: { requiresAuth: true }
  },
  {
    path: '/products',
    component: ProductsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/products/create',
    component: ProductCreateView,
    meta: { requiresAuth: true }
  },
  {
    path: '/products/edit/:id',
    component: ProductEditView,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/chat',
    component: ChatView,
    meta: { requiresAuth: true }
  },
  {
    path: "/admin/users",
    component: AdminUser,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  console.log("Navigation Guard:");
  console.log("Ruta destino:", to.path);
  console.log("Token existe:", !!token);
  console.log("User existe:", !!user);

  // Si requiere autenticación
  if (to.meta.requiresAuth && !token) {
    return next("/login");
  }

  // Si es ruta de invitados (login/register) y ya está logueado
  if (to.meta.requiresGuest && token) {
    return next("/home");
  }

  // 🔥 Validación especial para rutas solo ADMIN
  if (to.meta.requiresAdmin) {
    const parsedUser = JSON.parse(user || "{}");

    if (parsedUser.role !== "admin") {
      console.warn("❌ Acceso denegado: usuario no es admin");
      return next("/home"); // redirigimos a Home si no es admin
    }
  }

  next();
});


export default router