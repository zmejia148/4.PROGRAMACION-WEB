<template>
  <div class="edit-product-container">
    <!-- Main Content -->
    <main class="edit-product-main">
      <div class="form-container">
        <!-- Header -->
        <div class="form-header">
          <router-link to="/products" class="back-btn">
            <span>←</span>
            Volver a Productos
          </router-link>
          <h1>Editar Producto</h1>
          <p>Modifica la información del producto</p>
        </div>

        <!-- Loading State -->
        <div v-if="!productLoaded" class="loading-state">
          <div class="spinner"></div>
          <p>Cargando producto...</p>
        </div>

        <!-- Product Form -->
        <form v-else @submit.prevent="updateProduct" class="product-form">
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
                <option value="" disabled>Selecciona una categoría</option>
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
              <small class="input-help">Opcional - Deja vacío para mantener la imagen actual</small>
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

          <!-- Current Product Info -->
          <div class="current-info">
            <h3>Información Actual</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">ID del Producto:</span>
                <span class="info-value">{{ id }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Última Actualización:</span>
                <span class="info-value">{{ new Date().toLocaleDateString() }}</span>
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
              type="button"
              @click="resetForm"
              class="btn btn-outline"
            >
              Restablecer
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="btn btn-primary"
              :class="{ 'loading': loading }"
            >
              <span v-if="loading" class="spinner"></span>
              {{ loading ? 'Actualizando...' : 'Actualizar Producto' }}
            </button>
          </div>
        </form>
      </div>
    </main>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="modal-overlay">
      <div class="modal-content success-modal">
        <div class="modal-icon">✅</div>
        <h3>¡Producto Actualizado!</h3>
        <p>El producto se ha actualizado correctamente</p>
        <div class="modal-actions">
          <button @click="goToProducts" class="btn btn-primary">
            Ver Lista de Productos
          </button>
          <button @click="continueEditing" class="btn btn-secondary">
            Seguir Editando
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getProductById, updateProduct } from "../services/productService";

export default {
  name: 'ProductEditView',
  data() {
    return {
      id: null,
      name: "",
      description: "",
      price: "",
      category: "",
      image: "",
      productLoaded: false,
      loading: false,
      showSuccessModal: false,
      imageError: false,
      originalData: {}
    };
  },

  async created() {
    this.id = this.$route.params.id;
    await this.loadProduct();
  },

  methods: {
    async loadProduct() {
      try {
        const response = await getProductById(this.id);
        const product = response.data || response;

        // Guardar datos originales para reset
        this.originalData = {
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category || '',
          image: product.image || ''
        };

        // Asignar datos al formulario
        this.name = this.originalData.name;
        this.description = this.originalData.description;
        this.price = this.originalData.price;
        this.category = this.originalData.category;
        this.image = this.originalData.image;

        this.productLoaded = true;
      } catch (error) {
        console.error('Error cargando producto:', error);
        alert("Error al cargar el producto");
        this.$router.push("/products");
      }
    },

    async updateProduct() {
      try {
        this.loading = true;

        const productData = {
          name: this.name.trim(),
          description: this.description.trim(),
          price: parseFloat(this.price),
          category: this.category,
          image: this.image.trim() || null
        };

        console.log('Actualizando producto:', productData);

        await updateProduct(this.id, productData);
        
        this.showSuccessModal = true;
        
      } catch (error) {
        console.error('Error actualizando producto:', error);
        alert("Error al actualizar producto: " + (error.response?.data?.message || 'Inténtalo de nuevo'));
      } finally {
        this.loading = false;
      }
    },

    cancel() {
      if (this.hasChanges()) {
        if (confirm('¿Estás seguro de que quieres cancelar? Se perderán los cambios no guardados.')) {
          this.$router.push('/products');
        }
      } else {
        this.$router.push('/products');
      }
    },

    resetForm() {
      if (this.hasChanges()) {
        if (confirm('¿Restablecer todos los campos a los valores originales?')) {
          this.name = this.originalData.name;
          this.description = this.originalData.description;
          this.price = this.originalData.price;
          this.category = this.originalData.category;
          this.image = this.originalData.image;
          this.imageError = false;
        }
      }
    },

    hasChanges() {
      return (
        this.name !== this.originalData.name ||
        this.description !== this.originalData.description ||
        this.price !== this.originalData.price ||
        this.category !== this.originalData.category ||
        this.image !== this.originalData.image
      );
    },

    goToProducts() {
      this.showSuccessModal = false;
      this.$router.push('/products');
    },

    continueEditing() {
      this.showSuccessModal = false;
      // Recargar datos originales con los nuevos valores
      this.loadProduct();
    },

    handleImageError() {
      this.imageError = true;
    }
  }
};
</script>

<style src="../assets/css/productEdit.css"></style>
