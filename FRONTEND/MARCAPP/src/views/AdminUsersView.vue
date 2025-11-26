<template>
  <div class="users-page">
    <div class="users-container">
      <!-- Header de administración -->
      <div class="admin-header">
        <div class="header-content">
          <div class="admin-icon">👥</div>
          <div>
            <h1>Administración de Usuarios</h1>
            <p>Gestiona los usuarios y permisos del sistema</p>
          </div>
        </div>
        <div class="header-stats">
          <div class="stat-card">
            <div class="stat-number">{{ users.length }}</div>
            <div class="stat-label">Usuarios Totales</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ adminCount }}</div>
            <div class="stat-label">Administradores</div>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Cargando usuarios...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="users.length === 0" class="empty-state">
        <div class="empty-icon">👥</div>
        <h2>No hay usuarios registrados</h2>
        <p>Cuando los usuarios se registren, aparecerán aquí.</p>
      </div>

      <!-- Users Table -->
      <div v-else class="table-container">
        <table class="users-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Rol</th>
              <th>Cambiar Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="u in users" :key="u._id" class="user-row">
              <td class="user-info">
                <div class="user-avatar-small">
                  {{ u.username.charAt(0).toUpperCase() }}
                </div>
                <span class="username">{{ u.username }}</span>
              </td>
              <td>
                <span :class="['role-tag', u.role]">
                  {{ u.role === 'admin' ? 'Administrador' : 'Usuario' }}
                </span>
              </td>

              <!-- Cambiar Rol -->
              <td>
                <div class="role-controls">
                  <select v-model="u.newRole" class="role-select">
                    <option value="user">Usuario</option>
                    <option value="admin">Administrador</option>
                  </select>
                  <button 
                    class="save-btn" 
                    @click="updateRole(u)"
                    :disabled="u.role === u.newRole"
                  >
                    <span class="btn-icon">💾</span>
                    Guardar
                  </button>
                </div>
              </td>

              <!-- Eliminar -->
              <td>
                <button 
                  class="delete-btn" 
                  @click="confirmDelete(u)"
                  :disabled="u.role === 'admin' && adminCount <= 1"
                >
                  <span class="btn-icon">🗑️</span>
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Delete Modal -->
      <div v-if="showModal" class="modal-overlay">
        <div class="modal-content">
          <div class="modal-header">
            <div class="modal-icon">⚠️</div>
            <h3>¿Eliminar usuario?</h3>
            <button @click="cancelDelete" class="close-btn">×</button>
          </div>
          
          <div class="modal-body">
            <p>Estás a punto de eliminar al usuario <strong>"{{ userToDelete?.username }}"</strong>.</p>
            <p class="warning-text">Esta acción no se puede deshacer.</p>
          </div>

          <div class="modal-actions">
            <button class="cancel-btn" @click="cancelDelete">Cancelar</button>
            <button class="confirm-btn" @click="deleteUser">Sí, eliminar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "AdminUsersView",

  data() {
    return {
      users: [],
      loading: true,
      showModal: false,
      userToDelete: null
    };
  },

  computed: {
    adminCount() {
      return this.users.filter(u => u.role === 'admin').length;
    }
  },

  async mounted() {
    // Validar que solo admin pueda entrar
    const role = localStorage.getItem("role");

    if (role !== "admin") {
      alert("Acceso restringido. Solo administradores.");
      this.$router.push("/home");
      return;
    }

    this.loadUsers();
  },

  methods: {
    async loadUsers() {
      try {
        this.loading = true;

        const res = await axios.get("http://localhost:3000/api/users", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        });

        // Se agregará newRole a cada usuario
        this.users = res.data.map(u => ({
          ...u,
          newRole: u.role
        }));

      } catch (err) {
        console.error("Error cargando usuarios:", err);
        alert("Error al cargar usuarios");
      } finally {
        this.loading = false;
      }
    },

    async updateRole(user) {
      try {
        const res = await axios.put(
          `http://localhost:3000/api/users/${user._id}/role`,
          { role: user.newRole },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          }
        );

        alert("Rol actualizado correctamente");
        this.loadUsers();
      } catch (err) {
        console.error("Error actualizando rol:", err);
        alert("Error al actualizar el rol");
      }
    },

    confirmDelete(user) {
      this.userToDelete = user;
      this.showModal = true;
    },

    cancelDelete() {
      this.showModal = false;
      this.userToDelete = null;
    },

    async deleteUser() {
      try {
        await axios.delete(
          `http://localhost:3000/api/users/${this.userToDelete._id}`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          }
        );

        alert("Usuario eliminado");
        this.showModal = false;
        this.loadUsers();

      } catch (err) {
        console.error("Error eliminando usuario:", err);
        alert("No se pudo eliminar el usuario");
      }
    }
  }
};
</script>

<style src="../assets/css/usersAdminView.css"></style>