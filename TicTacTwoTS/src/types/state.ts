export interface GameState {
    placedSymbols: { X: number; O: number };
    currentPlayer: "X" | "O";
    selectedPiece: { row: number; col: number } | null;
    gridRow: number;
    gridCol: number;
    gameMode: "multi" | "single";
    gameOver: boolean;
    gameStarted: boolean;
}