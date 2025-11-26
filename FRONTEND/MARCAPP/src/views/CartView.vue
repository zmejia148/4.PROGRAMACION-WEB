<template>
  <div class="cart-page">
        <div class="cart-container">
      <!-- Header del carrito -->
      <div class="cart-header">
        <div class="header-content">
          <div class="cart-icon">🛒</div>
          <div>
            <h1>Carrito de Compras</h1>
            <p>Gestiona tus productos seleccionados</p>
          </div>
        </div>
      </div>

      <!-- Carrito vacío -->
      <div v-if="cart.length === 0" class="empty-cart">
        <div class="empty-icon">🛍️</div>
        <h2>Tu carrito está vacío</h2>
        <p>Explora nuestra tienda y añade tus productos favoritos</p>

        <router-link to="/products" class="btn-buy">
          <span class="btn-icon">🚀</span>
          Explorar Productos
        </router-link>
      </div>

      <!-- Lista de productos -->
      <div v-else class="cart-content">
        <div class="cart-list">
          <div class="cart-item" v-for="item in cart" :key="item.id">
            <div class="item-image">
              <div class="image-placeholder">
                {{ item.name.charAt(0) }}
              </div>
            </div>

            <div class="item-info">
              <h3 class="item-name">{{ item.name }}</h3>
              <p class="item-description">{{ item.description || 'Producto de calidad' }}</p>
              <p class="price">$ {{ formatPrice(item.price) }}</p>

              <!-- Control de cantidades -->
              <div class="quantity-controls">
                <button @click="decrease(item)" class="qty-btn">−</button>
                <span class="quantity">{{ item.quantity }}</span>
                <button @click="increase(item)" class="qty-btn">+</button>
              </div>
            </div>

            <!-- Eliminar -->
            <button class="delete-btn" @click="removeItem(item.id)" title="Eliminar producto">
              <span class="delete-icon">🗑️</span>
            </button>
          </div>
        </div>

        <!-- Resumen del carrito -->
        <div class="cart-summary">
          <div class="summary-card">
            <h3>Resumen de Compra</h3>

            <div class="summary-row">
              <span>Subtotal:</span>
              <span>$ {{ formatPrice(total) }}</span>
            </div>

            <div class="summary-row">
              <span>Envío:</span>
              <span class="free-shipping">Gratis</span>
            </div>

            <div class="summary-divider"></div>

            <div class="summary-row total">
              <span>Total:</span>
              <span>$ {{ formatPrice(total) }}</span>
            </div>

            <div class="cart-buttons">
              <button @click="clearCart" class="btn-clear">
                <span class="btn-icon">🗑️</span>
                Vaciar Carrito
              </button>
              <button class="btn-pay">
                <span class="btn-icon">💳</span>
                Finalizar Compra
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CartView',

  data() {
    return {
      cart: [
        // Datos de ejemplo - reemplazar con datos reales
        {
          id: 1,
          name: 'Pantalla Toros',
          price: 1200.34,
          quantity: 1,
          description: 'Monitor gaming profesional',
        },
        {
          id: 2,
          name: 'CPU ASUS ROG G16',
          price: 1589.32,
          quantity: 1,
          description: 'Intel Core i7, RTX 4090',
        },
      ],
    }
  },

  mounted() {
    this.loadCart()
  },

  computed: {
    total() {
      return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    },
  },

  methods: {
    loadCart() {
      // Cargar carrito desde localStorage o usar datos de ejemplo
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        this.cart = JSON.parse(savedCart)
      }
    },

    saveCart() {
      localStorage.setItem('cart', JSON.stringify(this.cart))
    },

    increase(item) {
      item.quantity++
      this.saveCart()
    },

    decrease(item) {
      if (item.quantity > 1) {
        item.quantity--
      } else {
        this.removeItem(item.id)
      }
      this.saveCart()
    },

    removeItem(id) {
      this.cart = this.cart.filter((item) => item.id !== id)
      this.saveCart()
    },

    clearCart() {
      if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
        this.cart = []
        this.saveCart()
      }
    },

    formatPrice(price) {
      return new Intl.NumberFormat('es-MX', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(price)
    },
  },
}
</script>

<style src="../assets/css/cartView.css"></style>
