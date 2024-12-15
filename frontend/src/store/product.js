import { create } from "zustand";

export const useProductStore = create((set) => ({
  products: [],
  setProduct: (products) => set({ products }),
  createProduct: async (newProduct) => {
    if (!newProduct.name || !newProduct.price || !newProduct.price) {
      return { success: false, message: "Please fill up all fields" };
    }
    const response = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    });
    const createdProduct = await response.json();
    set((state) => ({ products: [...state.products, createdProduct.data] }));
    return { success: true, message: "Product created successfully" };
  },
  fetchProducts: async () => {
    const response = await fetch(`/api/products`);
    const fetchProducts = await response.json();
    set({ products: fetchProducts.data });
  },
  deleteProduct: async (productId) => {
    const response = await fetch(`/api/products/${productId}`, {
      method: "DELETE",
    });
    const deletedProduct = await response.json();

    if (!deletedProduct.success) {
      return { success: false, message: deletedProduct.message };
    }

    set((state) => ({
      products: state.products.filter((product) => product._id !== productId),
    }));
    return { success: true, message: "Product deleted Successfully" };
  },
  updateProduct: async (productId, updatedProduct) => {
    const response = await fetch(`/api/products/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProduct),
    });
    const data = await response.json();
    if (!data.success) {
      return { success: false, message: data.message };
    }
    set((state) => ({
      products: state.products.map((product) =>
        product._id === productId ? data.data : product
      ),
    }));
    return { success: true, message: "Product updated Successfully" };
  },
}));
