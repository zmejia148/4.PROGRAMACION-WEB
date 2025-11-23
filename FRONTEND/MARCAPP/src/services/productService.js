import api from './api'

// Obtener todos los productos
export const getProducts = () => api.get('/products')

// Crear producto
export const createProduct = (data) => api.post('/products', data)

// Obtener un producto por ID (EL QUE FALTABA)
export const getProductById = (id) => api.get(`/products/${id}`)

// Editar producto
export const updateProduct = (id, data) => api.put(`/products/${id}`, data)

// Eliminar producto
export const deleteProduct = (id) => api.delete(`/products/${id}`)
