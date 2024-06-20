export default class LocalStorageService {
  static setItem<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  static getItem<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) as T : null;
  }

  static removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  static clear(): void {
    localStorage.clear();
  }
}