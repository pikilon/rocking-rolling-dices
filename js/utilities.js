export function getDefaultDice() {
  return { title: "New Dice", sides: ["1", "2", "3", "4", "5", "6"] };
}

export function getEmptyGame() {
  return { title: "", dices: {} };
}

export function getGameUrl() {
  const searchParams = new URLSearchParams(window.location.search);
  const gameParam = searchParams.get("game");
  return gameParam ? JSON.parse(decodeURIComponent(gameParam)) : getEmptyGame();
}

export function setGameUrl(
  { title = "", dices: newDices = {} } = getEmptyGame()
) {
  const prevGame = getGameUrl();
  const dices = { ...prevGame.dices, ...newDices };
  const updatedGame = { ...prevGame, title, dices };
  const searchParams = new URLSearchParams();
  searchParams.set("game", encodeURIComponent(JSON.stringify(updatedGame)));
  window.history.replaceState({}, "", `?${searchParams.toString()}`);
  return updatedGame;
}
