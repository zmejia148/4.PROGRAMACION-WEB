<template>
  <div class="auth-container">
    <nav class="auth-navbar">
      <div class="navbar-brand">
        <div class="brand-logo"><h2>M</h2></div>
        <span class="brand-name">ARCAPP</span>
      </div>
    </nav>

    <div class="auth-box">
      <div class="auth-header">
        <div class="auth-icon">🔐</div>
        <h2>Iniciar Sesión</h2>
        <p>Bienvenido de vuelta a tu cuenta</p>
      </div>

      <form @submit.prevent="login" class="auth-form">
        <div class="input-group">
          <input 
            v-model="username" 
            placeholder="Usuario" 
            required 
            class="auth-input"
          />
          <span class="input-icon">👤</span>
        </div>

        <div class="input-group">
          <input 
            v-model="password" 
            type="password" 
            placeholder="Contraseña" 
            required 
            class="auth-input"
          />
          <span class="input-icon">🔒</span>
        </div>

        <button class="auth-btn" type="submit" :disabled="loading">
          <span v-if="loading" class="btn-loading">⏳</span>
          <span v-else>Entrar</span>
        </button>
      </form>

      <div class="auth-footer">
        <router-link class="auth-link" to="/register">
          ¿No tienes cuenta? <span>Crear una cuenta</span>
        </router-link>
      </div>
    </div>

    <div class="auth-page-footer">
      <p>&copy; 2024 zatda. Todos los derechos reservados.</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: 'LoginView',

  data() {
    return {
      username: "",
      password: "",
      loading: false,
    };
  },

  methods: {
    async login() {
      this.loading = true;

      try {

        const response = await axios.post("http://localhost:3000/api/auth/login", {
          username: this.username,
          password: this.password
        });

        console.log("📦 Respuesta login:", response.data);

        const { token, user } = response.data;

        if (!token || !user) {
          throw new Error("Respuesta incompleta del servidor");
        }

        // 💾 GUARDAR TODO CORRECTAMENTE
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("role", user.role);

        console.log("🛠 Rol guardado:", user.role);
        console.log("🛠 Usuario guardado:", user.username);

        // 🔥 Redirigir al home
        this.$router.push("/home");

      } catch (error) {
        console.error("❌ Error en login:", error);
        alert("Error: " + (error.response?.data?.error || error.message));
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style src="../assets/css/auth.css"></style>
