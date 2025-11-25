<template>
  <div class="auth-container">
    <nav class="auth-navbar">
      <div class="navbar-brand">
        <div class="brand-logo"><H2>M</H2></div>
        <span class="brand-name">ARCAPP</span>
      </div>
    </nav>

    <div class="auth-box">
      <!-- Encabezado con icono -->
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
        
        <router-link class="auth-link" to="/forgot-password">
          ¿Olvidaste tu contraseña?
        </router-link>
      </div>
    </div>

    <!-- Footer -->
    <div class="auth-page-footer">
      <p>&copy; 2024 zatda. Todos los derechos reservados.</p>
    </div>
  </div>
</template>

<script>
import { loginUser } from "../services/authService";

export default {
  name: 'LoginView',
  data() {
    return {
      username: "",
      password: "",
      loading: false
    };
  },

  methods: {
    async login() {
      this.loading = true;
      
      try {
        console.log("🔐 Intentando login con:", this.username);
        
        const response = await loginUser({
          username: this.username,
          password: this.password,
        });

        console.log("✅ Respuesta completa:", response);
        
        // CORRECCIÓN: La respuesta de axios está en response.data
        const userData = response.data;
        
        console.log("📦 Datos de usuario:", userData);

        if (userData && userData.token) {
          // VERIFICACIÓN CRÍTICA: Asegúrate de que user existe
          if (!userData.user) {
            console.error("❌ userData.user es undefined:", userData);
            throw new Error("El servidor no devolvió datos de usuario");
          }
          
          // GUARDADO SEGURO
          localStorage.setItem("user", JSON.stringify(userData.user));
          localStorage.setItem("token", userData.token);
          
          console.log("🗝️ Token guardado:", userData.token);
          console.log("👤 Usuario guardado:", userData.user);
          console.log("📋 localStorage user:", localStorage.getItem("user"));
          
          // Mostrar mensaje de éxito
          this.showSuccess = true;
          
          // Redirigir después de un breve delay
          setTimeout(() => {
            this.$router.push("/home");
          }, 1000);
          
        } else {
          console.error("❌ Estructura inválida:", userData);
          throw new Error("Respuesta del servidor incompleta");
        }
        
      } catch (error) {
        console.error("❌ Error en login:", error);
        alert("Error: " + (error.response?.data?.message || error.message));
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style src="../assets/css/auth.css"></style>


