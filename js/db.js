// db.js

const DB_NAME = "rockingRollingDicesDB";
const DB_VERSION = 1;
const STORES = {
  DICES: "dices",
  GAME_SETS: "game-sets",
};

class IndexedDB {
  constructor() {
    this.db = null;
    this.isReady = false;
    this._initPromise = this._init();
  }

  async _init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error("Error opening IndexedDB:", request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        this.isReady = true;
        console.log("IndexedDB initialized successfully");
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create dices object store
        if (!db.objectStoreNames.contains(STORES.DICES)) {
          const dicesStore = db.createObjectStore(STORES.DICES, {
            keyPath: "title",
          });
          console.log("Created dices object store");
        }

        // Create game-sets object store
        if (!db.objectStoreNames.contains(STORES.GAME_SETS)) {
          db.createObjectStore(STORES.GAME_SETS, {
            keyPath: "title",
          });
          console.log("Created game-sets object store");
        }
      };
    });
  }

  async _ensureReady() {
    if (!this.isReady) {
      await this._initPromise;
    }
  }

  async _getObjectStore(storeName, mode = "readonly") {
    await this._ensureReady();
    const transaction = this.db.transaction([storeName], mode);
    return transaction.objectStore(storeName);
  }

  // Dices collection: { title: string, values: string[] }
  async getDices() {
    try {
      const store = await this._getObjectStore(STORES.DICES);
      const request = store.getAll();

      return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error("Error getting dices:", error);
      return [];
    }
  }

  async addDice(dice) {
    try {
      const store = await this._getObjectStore(STORES.DICES, "readwrite");
      const request = store.add(dice);

      return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error("Error adding dice:", error);
      throw error;
    }
  }

  async updateDice(title, newDice) {
    try {
      const store = await this._getObjectStore(STORES.DICES, "readwrite");
      const request = store.put(newDice);

      return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error("Error updating dice:", error);
      throw error;
    }
  }

  async removeDice(title) {
    try {
      const store = await this._getObjectStore(STORES.DICES, "readwrite");
      const request = store.delete(title);

      return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error("Error removing dice:", error);
      throw error;
    }
  }

  // Game-sets collection: { title: string, dices: string[] }
  async getGameSets() {
    try {
      const store = await this._getObjectStore(STORES.GAME_SETS);
      const request = store.getAll();

      return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error("Error getting game sets:", error);
      return [];
    }
  }

  async addGameSet(gameSet) {
    try {
      const store = await this._getObjectStore(STORES.GAME_SETS, "readwrite");
      const request = store.add(gameSet);

      return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error("Error adding game set:", error);
      throw error;
    }
  }

  async updateGameSet(title, newGameSet) {
    try {
      const store = await this._getObjectStore(STORES.GAME_SETS, "readwrite");
      const request = store.put(newGameSet);

      return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error("Error updating game set:", error);
      throw error;
    }
  }

  async removeGameSet(title) {
    try {
      const store = await this._getObjectStore(STORES.GAME_SETS, "readwrite");
      const request = store.delete(title);

      return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error("Error removing game set:", error);
      throw error;
    }
  }

  // Utility method to close the database connection
  close() {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.isReady = false;
    }
  }
}

const db = new IndexedDB();

export default db;
