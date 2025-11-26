<template>
  <div class="products-container">
    <!-- Main Content -->
    <main class="products-main">
      <div class="products-actions">
        <h2>Lista de Productos</h2>

        <!-- Botón "Agregar Producto" solo para admin -->
        <router-link 
          v-if="role === 'admin'"
          to="/products/create" 
          class="add-product-btn"
        >
          <span>+</span>
          Agregar Producto
        </router-link>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando productos...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="products.length === 0" class="empty-state">
        <div class="empty-icon">📦</div>
        <h3>No hay productos registrados</h3>

        <router-link 
          v-if="role === 'admin'"
          to="/products/create" 
          class="empty-btn"
        >
          Agregar Primer Producto
        </router-link>
      </div>

      <!-- Products Grid -->
      <div v-else class="products-grid">
        <div class="product-card" v-for="p in products" :key="p._id">

          <div class="product-image">
            <img :src="p.image || '/placeholder-image.jpg'" :alt="p.name" />

            <!-- BOTONES SOLO PARA ADMIN -->
            <div class="product-actions" v-if="role === 'admin'">
              <router-link :to="'/products/edit/' + p._id" class="action-btn edit-btn">
                ✏️
              </router-link>

              <button @click="remove(p._id)" class="action-btn delete-btn">
                🗑️
              </button>
            </div>
          </div>

          <!-- Product Info -->
          <div class="product-info">
            <h3 class="product-name">{{ p.name }}</h3>
            <p class="product-price">${{ formatPrice(p.price) }}</p>

            <p class="product-description" v-if="p.description">
              {{ truncateDescription(p.description) }}
            </p>

            <div class="product-meta">
              <span class="product-category" v-if="p.category">
                {{ p.category }}
              </span>
            </div>

            <!-- NUEVO BOTÓN AGREGAR AL CARRITO -->
            <button class="cart-btn" @click="addToCart(p)">
              🛒 Agregar al carrito
            </button>
          </div>

        </div>
      </div>
    </main>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal-content">
        <h3>¿Eliminar producto?</h3>
        <p>Esta acción no se puede deshacer</p>
        <div class="modal-actions">
          <button @click="confirmDelete" class="confirm-btn">Sí, Eliminar</button>
          <button @click="cancelDelete" class="cancel-btn">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getProducts, deleteProduct } from "../services/productService";

export default {
  name: "ProductsView",
  data() {
    return {
      products: [],
      loading: true,
      showDeleteModal: false,
      productToDelete: null,
      role: null
    };
  },

  async mounted() {
    this.role = localStorage.getItem("role") || "user";
    await this.loadProducts();
  },

  methods: {
    async loadProducts() {
      try {
        this.loading = true;
        const res = await getProducts();
        this.products = res.data || [];
      } catch (error) {
        console.error("Error loading products:", error);
        alert("Error al cargar los productos");
      } finally {
        this.loading = false;
      }
    },

    remove(id) {
      this.productToDelete = id;
      this.showDeleteModal = true;
    },

    async confirmDelete() {
      try {
        await deleteProduct(this.productToDelete);
        this.products = this.products.filter(p => p._id !== this.productToDelete);
        this.showDeleteModal = false;
        this.productToDelete = null;
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Error al eliminar el producto");
      }
    },

    cancelDelete() {
      this.showDeleteModal = false;
      this.productToDelete = null;
    },

    // BOTÓN AGREGAR AL CARRITO
    addToCart(product) {
      let cart = JSON.parse(localStorage.getItem("cart") || "[]");

      cart.push({
        id: product._id,
        name: product.name,
        price: product.price,
        quantity: 1
      });

      localStorage.setItem("cart", JSON.stringify(cart));

      alert(`🛒 ${product.name} agregado al carrito`);
    },

    formatPrice(price) {
      return new Intl.NumberFormat("es-MX").format(price);
    },

    truncateDescription(description) {
      return description.length > 100
        ? description.substring(0, 100) + "..."
        : description;
    }
  }
};
</script>

<style src="../assets/css/productsView.css"></style>