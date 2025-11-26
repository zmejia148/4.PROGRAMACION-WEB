<template>
  <div class="home-container">
    <!-- Header -->
    <header class="home-header">
      <div class="header-content">
        <h1><b>Bienvenido a MARCAPP</b></h1>
        <div class="user-info">
          <span
            ><b>Hola, {{ user?.username || 'Usuario' }}</b></span
          >
          <button @click="logout" class="logout-btn">Cerrar Sesión</button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="home-main">
      <div class="welcome-section">
        <h2><b>Panel de Control</b></h2>

        <!-- TEXTO DIFERENTE POR ROL -->
        <p v-if="role === 'admin'">Administración del sistema – gestiona productos y usuarios.</p>
        <p v-else>Bienvenido al sistema, consulta información y productos.</p>
      </div>

      <!-- Action Cards -->
      <div class="actions-grid">
        <!-- Ver productos (todos pueden verlo) -->
        <div class="action-card" @click="goToProducts">
          <div class="card-icon">📦</div>
          <h3>Ver Productos</h3>
          <p>Consulta la lista completa de productos</p>
          <button class="card-btn">Acceder</button>
        </div>

        <!-- Crear productos → SOLO ADMIN -->
        <div class="action-card" v-if="role === 'admin'" @click="goToCreateProduct">
          <div class="card-icon">➕</div>
          <h3>Crear Producto</h3>
          <p>Agrega un nuevo producto al sistema</p>
          <button class="card-btn">Crear</button>
        </div>

        <!-- Administrar usuario → SOLO ADMIN -->
        <div class="action-card" v-if="role === 'admin'" @click="goToUserAdmin">
          <div class="card-icon">🧑‍💼</div>
          <h3>Administrar Usuarios</h3>
          <p>Gestiona Rol de los usuarios</p>
          <button class="card-btn">Usuarios</button>
        </div>

        <!-- Chat (todos lo pueden usar) -->
        <div class="action-card" @click="goToChat">
          <div class="card-icon">💬</div>
          <h3>Chat</h3>
          <p>Comunícate o consulta dudas dentro del sistema</p>
          <button class="card-btn">Abrir Chat</button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'HomeView',

  data() {
    return {
      user: null,
      role: null,
    }
  },

  mounted() {
    this.checkAuthentication()
  },

  methods: {
    checkAuthentication() {
      const storedUser = localStorage.getItem('user')
      const token = localStorage.getItem('token')

      if (!token) {
        this.$router.push('/login')
        return
      }

      if (!storedUser || storedUser === 'undefined' || storedUser === 'null') {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        this.$router.push('/login')
        return
      }

      try {
        this.user = JSON.parse(storedUser)
        this.role = this.user.role // ← AÑADIDO
      } catch (error) {
        console.error('Error parseando usuario:', error)
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        this.$router.push('/login')
      }
    },

    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      this.$router.push('/login')
    },

    goToProducts() {
      this.$router.push('/products')
    },

    goToCreateProduct() {
      this.$router.push('/products/create')
    },

    goToChat() {
      this.$router.push('/chat')
    },
    goToUserAdmin() {
      this.$router.push('/admin/users')
    },
  },
}
</script>

<style src="../assets/css/home.css"></style>
