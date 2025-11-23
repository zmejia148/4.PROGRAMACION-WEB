<template>
  <div>
    <!-- Mostrar NAVBAR solo si NO estamos en login, register o home -->
    <Navbar v-if="showNavbar" />

    <!-- Renderizar vistas -->
    <router-view />
  </div>
</template>

<script>
import Navbar from "./components/Navbar.vue";

export default {
  components: { Navbar },

  computed: {
    showNavbar() {
      const noNavbarRoutes = ["/", "/login", "/register", "/home"];
      return !noNavbarRoutes.includes(this.$route.path);
    }
  }
};
</script>

<style>
body {
  background: #f4f4f4;
}
</style>
