import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import HomeView from '../views/HomeView.vue'
import ProductsView from '../views/ProductsView.vue'
import ProductCreateView from '../views/ProductCreateView.vue'
import ProductEditView from '../views/ProductEditView.vue'

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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation Guard - VERIFICAR SI ESTÁ AUTENTICADO
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const user = localStorage.getItem('user')

  console.log('Navigation Guard:')
  console.log('Ruta destino:', to.path)
  console.log('Token existe:', !!token)
  console.log('User existe:', !!user)

  // Si la ruta requiere autenticación y no hay token
  if (to.meta.requiresAuth && !token) {
    console.log('Acceso denegado: requiere autenticación')
    next('/login')
    return
  }

  // Si la ruta es para invitados (login/register) y ya está autenticado
  if (to.meta.requiresGuest && token) {
    console.log('Ya está autenticado, redirigiendo a home')
    next('/home')
    return
  }

  console.log('Acceso permitido')
  next()
})

export default router