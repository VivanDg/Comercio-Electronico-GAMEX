const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('gamex_token', token);
      } else {
        localStorage.removeItem('gamex_token');
      }
    }
  }

  getToken(): string | null {
    if (this.token) return this.token;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('gamex_token');
    }
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error en la solicitud');
    }

    return data;
  }

  // Auth
  async register(nombre: string, email: string, password: string) {
    const res = await this.request<{ data: { user: import('@/types').User; token: string } }>(
      '/auth/register',
      { method: 'POST', body: JSON.stringify({ nombre, email, password }) }
    );
    this.setToken(res.data.token);
    return res.data;
  }

  async login(email: string, password: string) {
    const res = await this.request<{ data: { user: import('@/types').User; token: string } }>(
      '/auth/login',
      { method: 'POST', body: JSON.stringify({ email, password }) }
    );
    this.setToken(res.data.token);
    return res.data;
  }

  async logout() {
    await this.request('/auth/logout', { method: 'POST' });
    this.setToken(null);
  }

  async getProfile() {
    const res = await this.request<{ data: import('@/types').User }>('/auth/profile');
    return res.data;
  }

  // Products
  async getProducts(params?: Record<string, string | number>) {
    const query = params
      ? '?' + new URLSearchParams(
          Object.entries(params).map(([k, v]) => [k, String(v)])
        ).toString()
      : '';
    const res = await this.request<{ data: import('@/types').Product[]; meta: import('@/types').ApiResponse<unknown>['meta'] }>(
      `/products${query}`
    );
    return { products: res.data, meta: res.meta };
  }

  async getProduct(id: number) {
    const res = await this.request<{ data: import('@/types').Product }>(`/products/${id}`);
    return res.data;
  }

  async createProduct(data: Record<string, unknown>) {
    const res = await this.request<{ data: import('@/types').Product }>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data;
  }

  async updateProduct(id: number, data: Record<string, unknown>) {
    const res = await this.request<{ data: import('@/types').Product }>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.data;
  }

  async deleteProduct(id: number) {
    return this.request(`/products/${id}`, { method: 'DELETE' });
  }

  // Categories
  async getCategories() {
    const res = await this.request<{ data: import('@/types').Category[] }>('/categories');
    return res.data;
  }

  async createCategory(data: { nombre: string; descripcion?: string }) {
    const res = await this.request<{ data: import('@/types').Category }>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data;
  }

  async updateCategory(id: number, data: { nombre?: string; descripcion?: string }) {
    const res = await this.request<{ data: import('@/types').Category }>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.data;
  }

  async deleteCategory(id: number) {
    return this.request(`/categories/${id}`, { method: 'DELETE' });
  }

  // Cart
  async getCart() {
    const res = await this.request<{ data: import('@/types').Cart }>('/cart');
    return res.data;
  }

  async addToCart(productId: number, cantidad = 1) {
    const res = await this.request<{ data: import('@/types').Cart }>('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ productId, cantidad }),
    });
    return res.data;
  }

  async updateCartItem(productId: number, cantidad: number) {
    const res = await this.request<{ data: import('@/types').Cart }>(`/cart/items/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ cantidad }),
    });
    return res.data;
  }

  async removeFromCart(productId: number) {
    const res = await this.request<{ data: import('@/types').Cart }>(`/cart/items/${productId}`, {
      method: 'DELETE',
    });
    return res.data;
  }

  // Orders
  async createOrder() {
    const res = await this.request<{ data: import('@/types').Order }>('/orders', { method: 'POST' });
    return res.data;
  }

  async getMyOrders(page = 1) {
    const res = await this.request<{ data: import('@/types').Order[]; meta: import('@/types').ApiResponse<unknown>['meta'] }>(
      `/orders/my?page=${page}`
    );
    return { orders: res.data, meta: res.meta };
  }

  async getOrder(id: number) {
    const res = await this.request<{ data: import('@/types').Order }>(`/orders/${id}`);
    return res.data;
  }

  async getAllOrders(page = 1, estado?: string) {
    const query = estado ? `?page=${page}&estado=${estado}` : `?page=${page}`;
    const res = await this.request<{ data: import('@/types').Order[]; meta: import('@/types').ApiResponse<unknown>['meta'] }>(
      `/orders${query}`
    );
    return { orders: res.data, meta: res.meta };
  }

  async updateOrderStatus(id: number, estado: string) {
    const res = await this.request<{ data: import('@/types').Order }>(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ estado }),
    });
    return res.data;
  }

  // Payments
  async createPaymentPreference(orderId: number) {
    const res = await this.request<{ data: { initPoint: string; sandboxInitPoint: string; preferenceId: string } }>(
      '/payments/preference',
      { method: 'POST', body: JSON.stringify({ orderId }) }
    );
    return res.data;
  }

  async getPaymentStatus(orderId: number) {
    const res = await this.request<{ data: { estado: string; orderStatus: string; monto: number } }>(
      `/payments/${orderId}/status`
    );
    return res.data;
  }

  // Admin
  async getDashboard() {
    const res = await this.request<{ data: import('@/types').DashboardStats }>('/admin/dashboard');
    return res.data;
  }

  async getUsers(page = 1) {
    const res = await this.request<{ data: import('@/types').User[]; meta: import('@/types').ApiResponse<unknown>['meta'] }>(
      `/users?page=${page}`
    );
    return { users: res.data, meta: res.meta };
  }

  async getInventory(page = 1) {
    const res = await this.request<{ data: Array<{ id: number; stock: number; product: { id: number; nombre: string; precio: number } }>; meta: import('@/types').ApiResponse<unknown>['meta'] }>(
      `/inventory?page=${page}`
    );
    return { items: res.data, meta: res.meta };
  }

  async updateStock(productId: number, stock: number) {
    const res = await this.request<{ data: unknown }>(`/inventory/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ stock }),
    });
    return res.data;
  }
}

export const api = new ApiClient();
