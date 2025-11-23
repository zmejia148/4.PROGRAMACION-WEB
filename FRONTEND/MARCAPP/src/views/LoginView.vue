<template>
  <div class="auth-container">
    <div class="auth-box">
      <h2>Iniciar Sesión</h2>

      <form @submit.prevent="login">
        <input 
          v-model="username" 
          placeholder="Usuario" 
          required 
        />

        <input 
          v-model="password" 
          type="password" 
          placeholder="Contraseña" 
          required 
        />

        <button class="auth-btn" type="submit">Entrar</button>
      </form>

      <router-link class="auth-link" to="/register">
        Crear una cuenta
      </router-link>
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
    };
  },

  methods: {
    async login() {
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
          
          // Redirigir
          this.$router.push("/home");
        } else {
          console.error("❌ Estructura inválida:", userData);
          throw new Error("Respuesta del servidor incompleta");
        }
        
      } catch (error) {
        console.error("❌ Error en login:", error);
        alert("Error: " + (error.response?.data?.message || error.message));
      }
    },
  },
};
</script>

<style src="../assets/css/auth.css"></style>


