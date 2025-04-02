
export type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
export type PieceColor = 'white' | 'black';

export interface ChessPiece {
  type: PieceType;
  color: PieceColor;
  hasMoved?: boolean;
}

export interface ChessPosition {
  row: number;
  col: number;
}

export type ChessBoard = (ChessPiece | null)[][];

export interface ChessMove {
  from: ChessPosition;
  to: ChessPosition;
  piece: ChessPiece;
  capturedPiece?: ChessPiece | null;
  isCheck?: boolean;
  isCheckmate?: boolean;
  isPromotion?: boolean;
  promotedTo?: PieceType;
  isCastling?: boolean;
  isEnPassant?: boolean;
}

export interface ChessGameState {
  board: ChessBoard;
  currentTurn: PieceColor;
  moveHistory: ChessMove[];
  selectedPosition: ChessPosition | null;
  possibleMoves: ChessPosition[];
  isCheck: boolean;
  isCheckmate: boolean;
  isStalemate: boolean;
  lastMove: ChessMove | null;
  boardOrientation: PieceColor; // White means white at bottom, black means black at bottom
  computerPlayer: PieceColor | null; // Which color the computer plays as, null for no computer
}
