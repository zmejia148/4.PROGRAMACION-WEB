<template>
  <div class="auth-container">
    <nav class="auth-navbar">
      <div class="navbar-brand">
        <div class="brand-logo"><h2>M</h2></div>
        <span class="brand-name">ARCAPP</span>
      </div>
    </nav>
    <div class="auth-box">
      <!-- Encabezado con icono -->
      <div class="auth-header">
        <div class="auth-icon">🚀</div>
        <h2>Crear Cuenta</h2>
        <p>Únete a nuestra plataforma</p>
      </div>

      <form @submit.prevent="register" class="auth-form">
        <div class="input-group">
          <input 
            v-model="username" 
            placeholder="Usuario" 
            required 
            class="auth-input"
            @input="validateUsername"
          />
          <span class="input-icon">👤</span>
          <div v-if="usernameError" class="error-message">{{ usernameError }}</div>
        </div>

        <div class="input-group">
          <input 
            v-model="password" 
            type="password" 
            placeholder="Contraseña" 
            required 
            class="auth-input"
            @input="validatePassword"
          />
          <span class="input-icon">🔒</span>
          <div v-if="passwordError" class="error-message">{{ passwordError }}</div>
        </div>

        <div class="input-group">
          <input 
            v-model="confirmPassword" 
            type="password" 
            placeholder="Confirmar Contraseña" 
            required 
            class="auth-input"
            @input="validatePasswordMatch"
          />
          <span class="input-icon">✅</span>
          <div v-if="confirmPasswordError" class="error-message">{{ confirmPasswordError }}</div>
        </div>

        <!-- Indicador de fortaleza -->
        <div v-if="password" class="password-strength">
          <div class="strength-bar">
            <div 
              class="strength-fill" 
              :class="passwordStrength"
            ></div>
          </div>
          <div class="strength-text">Fortaleza: {{ strengthText }}</div>
        </div>

        <!-- Términos -->
        <div class="terms-group">
          <label class="checkbox-label">
            <input type="checkbox" v-model="acceptTerms" required class="checkbox-input" />
            <span class="checkbox-mark"></span>
            Acepto los <a href="#" class="terms-link">términos y condiciones</a>
          </label>
        </div>

        <button 
          class="auth-btn" 
          type="submit" 
          :disabled="loading || !isFormValid"
        >
          <span v-if="loading" class="btn-loading">⏳</span>
          <span v-else>Crear Cuenta</span>
        </button>
      </form>

      <div class="auth-footer">
        <router-link class="auth-link" to="/login">
          ¿Ya tienes cuenta? <span>Iniciar Sesión</span>
        </router-link>
      </div>
    </div>

    <div class="auth-page-footer">
      <p>&copy; 2024 zatda. Todos los derechos reservados.</p>
    </div>

    <!-- Modal éxito -->
    <div v-if="showSuccess" class="success-modal-overlay">
      <div class="success-modal">
        <div class="modal-header">
          <div class="success-icon">🎉</div>
          <button @click="closeModal" class="close-btn">×</button>
        </div>
        
        <div class="modal-body">
          <h3>¡Cuenta Creada Exitosamente!</h3>
          <p>Tu cuenta <strong>{{ username }}</strong> ha sido registrada correctamente.</p>
          <div class="success-animation">
            <div class="checkmark">✓</div>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="redirectToLogin" class="modal-btn primary">
            Continuar al Login
          </button>
          <button @click="closeModal" class="modal-btn secondary">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { registerUser } from "../services/authService";

export default {
  name: 'RegisterView',
  data() {
    return {
      username: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
      loading: false,
      showSuccess: false,
      usernameError: "",
      passwordError: "",
      confirmPasswordError: ""
    };
  },

  computed: {
    passwordStrength() {
      if (!this.password) return 'weak';
      const strength = this.calculatePasswordStrength(this.password);
      if (strength < 3) return 'weak';
      if (strength < 5) return 'medium';
      return 'strong';
    },

    strengthText() {
      const map = { weak: 'Débil', medium: 'Media', strong: 'Fuerte' };
      return map[this.passwordStrength];
    },

    isFormValid() {
      return (
        this.username &&
        this.password &&
        this.confirmPassword &&
        this.acceptTerms &&
        !this.usernameError &&
        !this.passwordError &&
        !this.confirmPasswordError
      );
    }
  },

  methods: {
    validateUsername() {
      if (this.username.length < 3) {
        this.usernameError = "El usuario debe tener al menos 3 caracteres";
      } else if (!/^[a-zA-Z0-9_]+$/.test(this.username)) {
        this.usernameError = "Solo se permiten letras, números y guiones bajos";
      } else {
        this.usernameError = "";
      }
    },

    validatePassword() {
      this.passwordError = this.password.length < 6 ? "La contraseña debe tener al menos 6 caracteres" : "";
      this.validatePasswordMatch();
    },

    validatePasswordMatch() {
      this.confirmPasswordError = 
        this.confirmPassword && this.password !== this.confirmPassword
          ? "Las contraseñas no coinciden"
          : "";
    },

    calculatePasswordStrength(password) {
      let strength = 0;
      if (password.length >= 6) strength++;
      if (password.length >= 8) strength++;
      if (/[A-Z]/.test(password)) strength++;
      if (/[0-9]/.test(password)) strength++;
      if (/[^A-Za-z0-9]/.test(password)) strength++;
      return strength;
    },

    async register() {
      this.loading = true;

      try {
        console.log("📝 Registrando:", this.username);

        // 🔥 AQUI ENVIAMOS EL ROL
        await registerUser({
          username: this.username,
          password: this.password,
          role: "user"   // 👈 OBLIGATORIO PARA EL BACKEND
        });

        this.showSuccess = true;

      } catch (err) {
        console.error("❌ Error en registro:", err);
        alert("Error al registrar: " + (err.response?.data?.message || err.message));
      } finally {
        this.loading = false;
      }
    },

    redirectToLogin() {
      this.$router.push("/login");
    },

    closeModal() {
      this.showSuccess = false;
    }
  }
};
</script>

<style src="../assets/css/auth.css"></style>
