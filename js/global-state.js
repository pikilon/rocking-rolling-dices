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
    console.log('this.state', this.state);
    this.listeners.forEach((listener) => listener(this.state, prevState));
  }

  addDice(dice) {
    this.setState((prevState) => ({
      ...prevState,
      dices: {
        ...prevState.dices,
        [dice.title]: dice,
      },
    }));
  }
  removeDice(diceTitle = "") {
    this.setState((prevState) => {
      const dices = { ...prevState.dices };
      console.log('dices', dices);
      delete dices[diceTitle];
      console.log('dices', dices);
      return { ...prevState, dices };
    });
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
