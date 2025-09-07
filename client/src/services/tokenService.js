// Secure token handling utilities
export class TokenService {
    static getToken() {
      return localStorage.getItem('token');
    }
  
    static setToken(token) {
      localStorage.setItem('token', token);
    }
  
    static removeToken() {
      localStorage.removeItem('token');
    }
  
    static isTokenExpired(token) {
      try {
        const { exp } = JSON.parse(atob(token.split('.')[1]));
        return Date.now() >= exp * 1000;
      } catch {
        return true;
      }
    }
  
    static getTokenData(token) {
      try {
        return JSON.parse(atob(token.split('.')[1]));
      } catch {
        return null;
      }
    }
  }
  