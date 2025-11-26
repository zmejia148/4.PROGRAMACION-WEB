<template>
  <div class="catalog-container">

    <main class="catalog-main">
      <h2>Catálogo de Productos</h2>

      <!-- Empty State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando productos...</p>
      </div>

      <div v-else-if="products.length === 0" class="empty-state">
        <div class="empty-icon">🛒</div>
        <h3>No hay productos disponibles</h3>
        <p>Pronto agregaremos más productos al catálogo</p>
      </div>

      <!-- Products Grid -->
      <div v-else class="catalog-grid">
        <div class="catalog-card" v-for="p in products" :key="p._id">

          <div class="catalog-image">
            <img :src="p.image || '/placeholder-image.jpg'" :alt="p.name" />
          </div>

          <div class="catalog-info">
            <h3 class="product-name">{{ p.name }}</h3>

            <p class="product-price">${{ formatPrice(p.price) }}</p>

            <p class="product-description" v-if="p.description">
              {{ truncateDescription(p.description) }}
            </p>
          </div>

          <button class="catalog-btn" @click="addToCart(p)">
            🛒 Agregar al Carrito
          </button>

        </div>
      </div>
    </main>

  </div>
</template>

<script>
import { getProducts } from "../services/productService";

export default {
  name: "CatalogView",

  data() {
    return {
      products: [],
      loading: true,
    };
  },

  async mounted() {
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

    addToCart(product) {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      cart.push(product);

      localStorage.setItem("cart", JSON.stringify(cart));

      alert("Producto agregado al carrito 🛒");
    },

    formatPrice(price) {
      return new Intl.NumberFormat("es-MX").format(price);
    },

    truncateDescription(text) {
      return text.length > 80 ? text.substring(0, 80) + "..." : text;
    }
  }
};
</script>

<style>
.catalog-container {
  padding: 20px;
}

.catalog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 20px;
}

.catalog-card {
  background: #fff;
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0px 3px 8px rgba(0,0,0,0.1);
  text-align: center;
}

.catalog-image img {
  width: 100%;
  border-radius: 10px;
}

.catalog-btn {
  margin-top: 10px;
  background: #00a8ff;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
}
</style>
