<template>
  <nav class="custom-navbar">
    <div class="nav-container">
      <!-- Logo/Brand -->
      <router-link to="/home" class="nav-brand">
        <div class="brand-content">
          <span class="brand-icon">🛍️</span>
          <span class="brand-text">MERCAPP</span>
        </div>
      </router-link>

      <!-- Mobile Toggle -->
      <button class="nav-toggle" @click="toggleMobileMenu" :class="{ active: isMobileMenuOpen }">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <!-- Navigation Links -->
      <div class="nav-menu" :class="{ active: isMobileMenuOpen }">
        <div class="nav-links">
          <router-link to="/home" class="nav-link" @click="closeMobileMenu">
            <span class="link-icon">🏠</span>
            Inicio
          </router-link>

          <router-link to="/products" class="nav-link" @click="closeMobileMenu">
            <span class="link-icon">📦</span>
            Productos
          </router-link>

          <!-- 🔵 SOLO ADMIN: Ver usuarios -->
          <router-link
            v-if="role === 'admin'"
            to="/admin/users"
            class="nav-link"
            @click="closeMobileMenu"
          >
            <span class="link-icon">🧑‍💼</span>
            Admin Usuarios
          </router-link>

          <!-- 🔵 SOLO ADMIN: Crear producto -->
          <router-link
            v-if="role === 'admin'"
            to="/products/create"
            class="nav-link highlight"
            @click="closeMobileMenu"
          >
            <span class="link-icon">➕</span>
            Nuevo Producto
          </router-link>

          <router-link to="/chat" class="nav-link" @click="closeMobileMenu">
            <span class="link-icon">💬</span>
            Chat
          </router-link>

          <router-link v-if="role === 'user'" to="/cart" class="nav-link" @click="closeMobileMenu">
            <span class="link-icon">🛒</span>
            Mi Carrito
          </router-link>

          <button @click="logout" class="nav-link logout-btn">
            <span class="link-icon">🚪</span>
            Salir
          </button>
        </div>

        <!-- User Info -->
        <div class="user-section" v-if="user">
          <div class="user-avatar">{{ getUserInitials }}</div>
          <div class="user-info">
            <h2 class="user-name">{{ user.username }}</h2>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
  data() {
    return {
      isMobileMenuOpen: false,
      user: null,
      role: null,
    }
  },

  mounted() {
    this.loadUser()
    document.addEventListener('click', this.handleClickOutside)
  },

  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  },

  computed: {
    getUserInitials() {
      if (!this.user || !this.user.username) return 'U'
      return this.user.username.charAt(0).toUpperCase()
    },
  },

  methods: {
    loadUser() {
      const storedUser = localStorage.getItem('user')
      const storedRole = localStorage.getItem('role')

      if (storedUser) {
        this.user = JSON.parse(storedUser)
      }

      if (storedRole) {
        this.role = storedRole
      }
    },

    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen
    },

    closeMobileMenu() {
      this.isMobileMenuOpen = false
    },

    handleClickOutside(event) {
      const navbar = this.$el
      if (!navbar.contains(event.target) && this.isMobileMenuOpen) {
        this.closeMobileMenu()
      }
    },

    logout() {
      localStorage.clear()
      this.$router.push('/login')
      this.closeMobileMenu()
    },
  },
}
</script>
