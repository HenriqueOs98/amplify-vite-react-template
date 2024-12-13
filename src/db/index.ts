import PocketBase from 'pocketbase';

class DatabaseClient {
  client: PocketBase;

  constructor() {
    this.client = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || 'https://coding-platform-js.pockethost.io');
  }

  async authenticate(email: string, password: string) {
    try {
      const authData = await this.client.collection("users").authWithPassword(email, password);
      return authData;
    } catch (err) {
      console.error("Authentication failed:", err);
      throw new Error("Authentication failed");
    }
  }

  async register(email: string, password: string, username: string) {
    try {
      const user = await this.client.collection("users").create({ 
        email, 
        password, 
        passwordConfirm: password,
        username,
      });
      return user;
    } catch (err) {
      console.error("Registration failed:", err);
      throw new Error("Registration failed");
    }
  }

  getAuthStore() {
    return this.client.authStore;
  }

  isAuthenticated() {
    return this.client.authStore.isValid;
  }

  getCurrentUser() {
    return this.client.authStore.model;
  }

  logout() {
    this.client.authStore.clear();
  }
}

export const db = new DatabaseClient();

