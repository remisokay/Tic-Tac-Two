export type AIMove = PlaceMove | GridMove | MovePieceMove;

export interface PlaceMove {
    type: "place";
    x: number;
    y: number;
    score?: number;
}

export interface GridMove {
    type: "grid";
    direction: string;
    score: number;
}

export interface MovePieceMove {
    type: "movePiece";
    from: {x: number, y: number};
    to: {x: number, y: number};
    score: number;
}