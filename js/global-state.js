// Reactive game state using a simple observer pattern

import { getGameUrl, setGameUrl } from "./utilities.js";

class ReactiveState {
  constructor(initialState) {
    this.state = initialState;
    this.listeners = [];
  }

  getState() {
    return this.state;
  }

  setState(updater) {
    const prevState = this.state;
    this.state = typeof updater === "function" ? updater(this.state) : updater;
    setGameUrl(this.state);
    this.listeners.forEach((listener) => listener(this.state, prevState));
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }
}

// Initial game state structure
const initialGameState = {
  title: "",
  dices: {
    // Example:
    // d6: { title: 'd6', quantity: 2, sides: ['1', '2', '3', '4', '5', '6'] }
  },
};

export const gameState = new ReactiveState(getGameUrl());

// Usage example:
// gameState.subscribe((newState, oldState) => { console.log(newState); });
// gameState.setState(state => ({ ...state, title: 'My Dice Game' }));
