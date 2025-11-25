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
      <button 
        class="nav-toggle" 
        @click="toggleMobileMenu"
        :class="{ 'active': isMobileMenuOpen }"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <!-- Navigation Links -->
      <div class="nav-menu" :class="{ 'active': isMobileMenuOpen }">
        <div class="nav-links">
          <router-link 
            to="/home" 
            class="nav-link"
            @click="closeMobileMenu"
          >
            <span class="link-icon">🏠</span>
            Inicio
          </router-link>

          <router-link 
            to="/products" 
            class="nav-link"
            @click="closeMobileMenu"
          >
            <span class="link-icon">📦</span>
            Productos
          </router-link>

          <router-link 
            to="/products/create" 
            class="nav-link highlight"
            @click="closeMobileMenu"
          >
            <span class="link-icon">➕</span>
            Nuevo Producto
          </router-link>

          <router-link 
            to="/chat" 
            class="nav-link"
            @click="closeMobileMenu"
          >
            <span class="link-icon">💬</span>
            Chat
          </router-link>

          <button 
            @click="logout" 
            class="nav-link logout-btn"
          >
            <span class="link-icon">🚪</span>
            Salir
          </button>
        </div>

        <!-- User Info (Optional) -->
        <div class="user-section" v-if="user">
          <div class="user-avatar">
            {{ getUserInitials }}
          </div>
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
      user: null
    };
  },

  mounted() {
    this.loadUser();
    // Cerrar menú móvil al hacer clic fuera
    document.addEventListener('click', this.handleClickOutside);
  },

  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  },

  computed: {
    getUserInitials() {
      if (!this.user || !this.user.username) return 'U';
      return this.user.username.charAt(0).toUpperCase();
    }
  },

  methods: {
    loadUser() {
      const storedUser = localStorage.getItem("user");
      if (storedUser && storedUser !== "undefined") {
        try {
          this.user = JSON.parse(storedUser);
        } catch (error) {
          console.error('Error loading user:', error);
        }
      }
    },

    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
    },

    closeMobileMenu() {
      this.isMobileMenuOpen = false;
    },

    handleClickOutside(event) {
      const navbar = this.$el;
      const toggleButton = navbar.querySelector('.nav-toggle');
      
      if (!navbar.contains(event.target) && this.isMobileMenuOpen) {
        this.closeMobileMenu();
      }
    },

    logout() {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      this.$router.push("/login");
      this.closeMobileMenu();
    }
  }
};
</script>
