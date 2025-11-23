<template>
  <div class="home-container">
    <!-- Header -->
    <header class="home-header">
      <div class="header-content">
        <h1><b>Bienvenido a MARCAPP</b></h1>
        <div class="user-info">
          <span><b>Hola, {{ user?.username || 'Usuario' }}</b></span>
          <button @click="logout" class="logout-btn">Cerrar Sesión</button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="home-main">
      <div class="welcome-section">
        <h2><b>Panel de Control</b></h2>
        <p>Gestiona tus productos desde aquí</p>
      </div>

      <!-- Action Cards -->
      <div class="actions-grid">
        <div class="action-card" @click="goToProducts">
          <div class="card-icon">📦</div>
          <h3>Ver Productos</h3>
          <p>Consulta la lista completa de productos</p>
          <button class="card-btn">Acceder</button>
        </div>

        <div class="action-card" @click="goToCreateProduct">
          <div class="card-icon">➕</div>
          <h3>Crear Producto</h3>
          <p>Agrega un nuevo producto al sistema</p>
          <button class="card-btn">Crear</button>
        </div>

        <div class="action-card" @click="goToEditProducts">
          <div class="card-icon">✏️</div>
          <h3>Editar Productos</h3>
          <p>Modifica productos existentes</p>
          <button class="card-btn">Editar</button>
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
      user: null
    };
  },

  mounted() {
    this.checkAuthentication();
  },

  methods: {
    checkAuthentication() {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (!token) {
        this.$router.push("/login");
        return;
      }

      if (!storedUser || storedUser === "undefined" || storedUser === "null") {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        this.$router.push("/login");
        return;
      }

      try {
        this.user = JSON.parse(storedUser);
      } catch (error) {
        console.error('Error parseando usuario:', error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        this.$router.push("/login");
      }
    },

    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      this.$router.push("/login");
    },

    goToProducts() {
      this.$router.push("/products");
    },

    goToCreateProduct() {
      this.$router.push("/products/create");
    },

    goToEditProducts() {
      this.$router.push("/products");
    }
  }
};
</script>

<style src="../assets/css/home.css"></style>
