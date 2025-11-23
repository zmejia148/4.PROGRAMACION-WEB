<template>
  <div class="auth-container">
    <div class="auth-box">
      <h2>Crear Cuenta</h2>

      <form @submit.prevent="register">
        <input v-model="username" placeholder="Usuario" required />
        <input v-model="password" type="password" placeholder="Contraseña" required />

        <button class="auth-btn" type="submit">Registrarse</button>
      </form>

      <router-link class="auth-link" to="/login">Volver al login</router-link>
    </div>
  </div>
</template>

<script>
import { registerUser } from "../services/authService";

export default {
  data() {
    return {
      username: "",
      password: "",
    };
  },

  methods: {
    async register() {
      try {
        await registerUser({
          username: this.username,
          password: this.password,
        });

        alert("Usuario registrado exitosamente");
        this.$router.push("/login");
      } catch (err) {
        alert("Error al registrar");
      }
    },
  },
};
</script>
