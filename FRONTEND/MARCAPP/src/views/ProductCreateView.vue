<template>
  <div class="create-product-container">
    <!-- Main Content -->
    <main class="create-product-main">
      <div class="form-container">
        <!-- Header -->
        <div class="form-header">
          <router-link to="/products" class="back-btn">
            <span>←</span>
            Volver a Productos
          </router-link>
          <h1>Crear Nuevo Producto</h1>
          <p>Completa la información del nuevo producto</p>
        </div>

        <!-- Product Form -->
        <form @submit.prevent="createProduct" class="product-form">
          <div class="form-grid">
            <!-- Nombre del Producto -->
            <div class="form-group">
              <label for="name" class="form-label">
                <span class="label-icon">📝</span>
                Nombre del Producto
              </label>
              <input
                id="name"
                v-model="name"
                type="text"
                class="form-input"
                placeholder="Ej: Laptop Gaming HP"
                required
                maxlength="100"
              />
              <span class="char-count">{{ name.length }}/100</span>
            </div>

            <!-- Precio -->
            <div class="form-group">
              <label for="price" class="form-label">
                <span class="label-icon">💰</span>
                Precio
              </label>
              <div class="price-input-container">
                <span class="currency-symbol">$</span>
                <input
                  id="price"
                  v-model="price"
                  type="number"
                  class="form-input price-input"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <!-- Categoría -->
            <div class="form-group">
              <label for="category" class="form-label">
                <span class="label-icon">🏷️</span>
                Categoría
              </label>
              <select
                id="category"
                v-model="category"
                class="form-select"
                required
              >
                <option value="" disabled selected>Selecciona una categoría</option>
                <option value="Electrónicos">Electrónicos</option>
                <option value="Ropa">Ropa</option>
                <option value="Hogar">Hogar</option>
                <option value="Deportes">Deportes</option>
                <option value="Libros">Libros</option>
                <option value="Juguetes">Juguetes</option>
                <option value="Otros">Otros</option>
              </select>
            </div>

            <!-- Imagen -->
            <div class="form-group full-width">
              <label for="image" class="form-label">
                <span class="label-icon">🖼️</span>
                URL de la Imagen
              </label>
              <input
                id="image"
                v-model="image"
                type="url"
                class="form-input"
                placeholder="https://ejemplo.com/imagen.jpg"
              />
              <small class="input-help">Opcional - Puedes agregarla después</small>
            </div>

            <!-- Descripción -->
            <div class="form-group full-width">
              <label for="description" class="form-label">
                <span class="label-icon">📄</span>
                Descripción del Producto
              </label>
              <textarea
                id="description"
                v-model="description"
                class="form-textarea"
                placeholder="Describe las características, especificaciones y beneficios del producto..."
                required
                rows="5"
                maxlength="500"
              ></textarea>
              <span class="char-count">{{ description.length }}/500</span>
            </div>
          </div>

          <!-- Image Preview -->
          <div v-if="image" class="image-preview-section">
            <h3>Vista Previa de la Imagen</h3>
            <div class="image-preview">
              <img :src="image" alt="Vista previa" @error="handleImageError" />
              <div v-if="imageError" class="image-error">
                ❌ No se pudo cargar la imagen
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="form-actions">
            <button
              type="button"
              @click="cancel"
              class="btn btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="btn btn-primary"
              :class="{ 'loading': loading }"
            >
              <span v-if="loading" class="spinner"></span>
              {{ loading ? 'Creando...' : 'Crear Producto' }}
            </button>
          </div>
        </form>
      </div>
    </main>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="modal-overlay">
      <div class="modal-content success-modal">
        <div class="modal-icon">✅</div>
        <h3>¡Producto Creado!</h3>
        <p>El producto se ha creado correctamente</p>
        <div class="modal-actions">
          <button @click="goToProducts" class="btn btn-primary">
            Ver Lista de Productos
          </button>
          <button @click="createAnother" class="btn btn-secondary">
            Crear Otro Producto
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createProduct } from "../services/productService";

export default {
  name: 'ProductCreateView',
  data() {
    return {
      name: "",
      description: "",
      price: "",
      category: "",
      image: "",
      loading: false,
      showSuccessModal: false,
      imageError: false
    };
  },

  methods: {
    async createProduct() {
      try {
        this.loading = true;

        const productData = {
          name: this.name.trim(),
          description: this.description.trim(),
          price: parseFloat(this.price),
          category: this.category,
          image: this.image.trim() || null
        };

        console.log('Enviando datos:', productData);

        await createProduct(productData);
        
        this.showSuccessModal = true;
        
      } catch (error) {
        console.error('Error creando producto:', error);
        alert("Error al crear producto: " + (error.response?.data?.message || 'Inténtalo de nuevo'));
      } finally {
        this.loading = false;
      }
    },

    cancel() {
      if (this.name || this.description || this.price || this.category) {
        if (confirm('¿Estás seguro de que quieres cancelar? Se perderán los datos no guardados.')) {
          this.$router.push('/products');
        }
      } else {
        this.$router.push('/products');
      }
    },

    goToProducts() {
      this.showSuccessModal = false;
      this.$router.push('/products');
    },

    createAnother() {
      this.showSuccessModal = false;
      this.resetForm();
    },

    resetForm() {
      this.name = "";
      this.description = "";
      this.price = "";
      this.category = "";
      this.image = "";
      this.imageError = false;
    },

    handleImageError() {
      this.imageError = true;
    }
  }
};
</script>

<style src="../assets/css/productCreate.css"></style>
