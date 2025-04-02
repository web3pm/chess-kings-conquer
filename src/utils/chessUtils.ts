import { ChessBoard, ChessGameState, ChessMove, ChessPiece, ChessPosition, PieceColor, PieceType } from "@/types/chess";

// Initialize a new chess board with pieces in starting positions
export const initializeBoard = (): ChessBoard => {
  const board: ChessBoard = Array(8).fill(null).map(() => Array(8).fill(null));

  // Place pawns
  for (let col = 0; col < 8; col++) {
    board[1][col] = { type: 'pawn', color: 'black' };
    board[6][col] = { type: 'pawn', color: 'white' };
  }

  // Place rooks
  board[0][0] = { type: 'rook', color: 'black' };
  board[0][7] = { type: 'rook', color: 'black' };
  board[7][0] = { type: 'rook', color: 'white' };
  board[7][7] = { type: 'rook', color: 'white' };

  // Place knights
  board[0][1] = { type: 'knight', color: 'black' };
  board[0][6] = { type: 'knight', color: 'black' };
  board[7][1] = { type: 'knight', color: 'white' };
  board[7][6] = { type: 'knight', color: 'white' };

  // Place bishops
  board[0][2] = { type: 'bishop', color: 'black' };
  board[0][5] = { type: 'bishop', color: 'black' };
  board[7][2] = { type: 'bishop', color: 'white' };
  board[7][5] = { type: 'bishop', color: 'white' };

  // Place queens
  board[0][3] = { type: 'queen', color: 'black' };
  board[7][3] = { type: 'queen', color: 'white' };

  // Place kings
  board[0][4] = { type: 'king', color: 'black' };
  board[7][4] = { type: 'king', color: 'white' };

  return board;
};

// Initialize a new game state
export const initializeGameState = (): ChessGameState => {
  return {
    board: initializeBoard(),
    currentTurn: 'white',
    moveHistory: [],
    selectedPosition: null,
    possibleMoves: [],
    isCheck: false,
    isCheckmate: false,
    isStalemate: false,
    lastMove: null,
    boardOrientation: 'white',
    computerPlayer: 'black'
  };
};

// Check if a position is within the board boundaries
export const isValidPosition = (position: ChessPosition): boolean => {
  return position.row >= 0 && position.row < 8 && position.col >= 0 && position.col < 8;
};

// Get the piece at a specific position
export const getPieceAtPosition = (board: ChessBoard, position: ChessPosition): ChessPiece | null => {
  if (!isValidPosition(position)) return null;
  return board[position.row][position.col];
};

// Create a deep copy of the board
export const copyBoard = (board: ChessBoard): ChessBoard => {
  return board.map(row => row.map(piece => piece ? { ...piece } : null));
};

// Deep copy game state
export const copyGameState = (state: ChessGameState): ChessGameState => {
  return {
    ...state,
    board: copyBoard(state.board),
    moveHistory: [...state.moveHistory],
    possibleMoves: [...state.possibleMoves],
  };
};

// Check if two positions are the same
export const isSamePosition = (pos1: ChessPosition, pos2: ChessPosition): boolean => {
  return pos1.row === pos2.row && pos1.col === pos2.col;
};

// Check if a position exists in an array of positions
export const positionInArray = (position: ChessPosition, positions: ChessPosition[]): boolean => {
  return positions.some(pos => isSamePosition(pos, position));
};

// Get all possible moves for a selected piece
export const getPossibleMoves = (state: ChessGameState, position: ChessPosition): ChessPosition[] => {
  const piece = getPieceAtPosition(state.board, position);
  if (!piece || piece.color !== state.currentTurn) return [];

  let possibleMoves: ChessPosition[] = [];
  
  switch (piece.type) {
    case 'pawn':
      possibleMoves = getPawnMoves(state.board, position);
      break;
    case 'rook':
      possibleMoves = getRookMoves(state.board, position);
      break;
    case 'knight':
      possibleMoves = getKnightMoves(state.board, position);
      break;
    case 'bishop':
      possibleMoves = getBishopMoves(state.board, position);
      break;
    case 'queen':
      possibleMoves = getQueenMoves(state.board, position);
      break;
    case 'king':
      possibleMoves = getKingMoves(state.board, position);
      break;
  }

  // Filter moves that would put the king in check
  return filterMovesForCheck(state, position, possibleMoves);
};

// Get possible moves for a pawn
const getPawnMoves = (board: ChessBoard, position: ChessPosition): ChessPosition[] => {
  const piece = getPieceAtPosition(board, position);
  if (!piece || piece.type !== 'pawn') return [];

  const moves: ChessPosition[] = [];
  const direction = piece.color === 'white' ? -1 : 1;
  const startRow = piece.color === 'white' ? 6 : 1;

  // Move forward one square
  const oneForward: ChessPosition = { row: position.row + direction, col: position.col };
  if (isValidPosition(oneForward) && !getPieceAtPosition(board, oneForward)) {
    moves.push(oneForward);

    // Move forward two squares from starting position
    if (position.row === startRow) {
      const twoForward: ChessPosition = { row: position.row + 2 * direction, col: position.col };
      if (!getPieceAtPosition(board, twoForward)) {
        moves.push(twoForward);
      }
    }
  }

  // Capture diagonally
  const diagonalLeft: ChessPosition = { row: position.row + direction, col: position.col - 1 };
  const diagonalRight: ChessPosition = { row: position.row + direction, col: position.col + 1 };

  if (isValidPosition(diagonalLeft)) {
    const pieceLeft = getPieceAtPosition(board, diagonalLeft);
    if (pieceLeft && pieceLeft.color !== piece.color) {
      moves.push(diagonalLeft);
    }
  }

  if (isValidPosition(diagonalRight)) {
    const pieceRight = getPieceAtPosition(board, diagonalRight);
    if (pieceRight && pieceRight.color !== piece.color) {
      moves.push(diagonalRight);
    }
  }

  // TODO: En passant and promotion logic can be added here

  return moves;
};

// Get possible moves for a rook
const getRookMoves = (board: ChessBoard, position: ChessPosition): ChessPosition[] => {
  const piece = getPieceAtPosition(board, position);
  if (!piece) return [];

  const moves: ChessPosition[] = [];
  const directions = [
    { row: -1, col: 0 }, // up
    { row: 1, col: 0 },  // down
    { row: 0, col: -1 }, // left
    { row: 0, col: 1 }   // right
  ];

  for (const dir of directions) {
    let currentPos = { row: position.row + dir.row, col: position.col + dir.col };
    
    while (isValidPosition(currentPos)) {
      const currentPiece = getPieceAtPosition(board, currentPos);
      
      if (!currentPiece) {
        moves.push({ ...currentPos });
      } else {
        if (currentPiece.color !== piece.color) {
          moves.push({ ...currentPos });
        }
        break;
      }
      
      currentPos = { row: currentPos.row + dir.row, col: currentPos.col + dir.col };
    }
  }

  return moves;
};

// Get possible moves for a knight
const getKnightMoves = (board: ChessBoard, position: ChessPosition): ChessPosition[] => {
  const piece = getPieceAtPosition(board, position);
  if (!piece) return [];

  const moves: ChessPosition[] = [];
  const knightMoves = [
    { row: -2, col: -1 }, { row: -2, col: 1 },
    { row: -1, col: -2 }, { row: -1, col: 2 },
    { row: 1, col: -2 }, { row: 1, col: 2 },
    { row: 2, col: -1 }, { row: 2, col: 1 }
  ];

  for (const move of knightMoves) {
    const newPos = { row: position.row + move.row, col: position.col + move.col };
    
    if (isValidPosition(newPos)) {
      const pieceAtNewPos = getPieceAtPosition(board, newPos);
      
      if (!pieceAtNewPos || pieceAtNewPos.color !== piece.color) {
        moves.push(newPos);
      }
    }
  }

  return moves;
};

// Get possible moves for a bishop
const getBishopMoves = (board: ChessBoard, position: ChessPosition): ChessPosition[] => {
  const piece = getPieceAtPosition(board, position);
  if (!piece) return [];

  const moves: ChessPosition[] = [];
  const directions = [
    { row: -1, col: -1 }, // up-left
    { row: -1, col: 1 },  // up-right
    { row: 1, col: -1 },  // down-left
    { row: 1, col: 1 }    // down-right
  ];

  for (const dir of directions) {
    let currentPos = { row: position.row + dir.row, col: position.col + dir.col };
    
    while (isValidPosition(currentPos)) {
      const currentPiece = getPieceAtPosition(board, currentPos);
      
      if (!currentPiece) {
        moves.push({ ...currentPos });
      } else {
        if (currentPiece.color !== piece.color) {
          moves.push({ ...currentPos });
        }
        break;
      }
      
      currentPos = { row: currentPos.row + dir.row, col: currentPos.col + dir.col };
    }
  }

  return moves;
};

// Get possible moves for a queen (combination of rook and bishop moves)
const getQueenMoves = (board: ChessBoard, position: ChessPosition): ChessPosition[] => {
  return [
    ...getRookMoves(board, position),
    ...getBishopMoves(board, position)
  ];
};

// Get possible moves for a king
const getKingMoves = (board: ChessBoard, position: ChessPosition): ChessPosition[] => {
  const piece = getPieceAtPosition(board, position);
  if (!piece) return [];

  const moves: ChessPosition[] = [];
  const kingMoves = [
    { row: -1, col: -1 }, { row: -1, col: 0 }, { row: -1, col: 1 },
    { row: 0, col: -1 }, { row: 0, col: 1 },
    { row: 1, col: -1 }, { row: 1, col: 0 }, { row: 1, col: 1 }
  ];

  for (const move of kingMoves) {
    const newPos = { row: position.row + move.row, col: position.col + move.col };
    
    if (isValidPosition(newPos)) {
      const pieceAtNewPos = getPieceAtPosition(board, newPos);
      
      if (!pieceAtNewPos || pieceAtNewPos.color !== piece.color) {
        moves.push(newPos);
      }
    }
  }

  // TODO: Castling logic can be added here

  return moves;
};

// Find the king's position for a given color
export const findKingPosition = (board: ChessBoard, color: PieceColor): ChessPosition | null => {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.type === 'king' && piece.color === color) {
        return { row, col };
      }
    }
  }
  return null;
};

// Check if a specific position is under attack by the opponent
export const isPositionUnderAttack = (board: ChessBoard, position: ChessPosition, attackingColor: PieceColor): boolean => {
  // Check for pawn attacks
  const pawnDirection = attackingColor === 'white' ? -1 : 1;
  const pawnAttacks = [
    { row: position.row - pawnDirection, col: position.col - 1 },
    { row: position.row - pawnDirection, col: position.col + 1 }
  ];

  for (const attack of pawnAttacks) {
    if (isValidPosition(attack)) {
      const piece = getPieceAtPosition(board, attack);
      if (piece && piece.type === 'pawn' && piece.color === attackingColor) {
        return true;
      }
    }
  }

  // Check for knight attacks
  const knightMoves = [
    { row: -2, col: -1 }, { row: -2, col: 1 },
    { row: -1, col: -2 }, { row: -1, col: 2 },
    { row: 1, col: -2 }, { row: 1, col: 2 },
    { row: 2, col: -1 }, { row: 2, col: 1 }
  ];

  for (const move of knightMoves) {
    const attackPos = { row: position.row + move.row, col: position.col + move.col };
    if (isValidPosition(attackPos)) {
      const piece = getPieceAtPosition(board, attackPos);
      if (piece && piece.type === 'knight' && piece.color === attackingColor) {
        return true;
      }
    }
  }

  // Check for rook/queen attacks (horizontal and vertical)
  const straightDirections = [
    { row: -1, col: 0 }, { row: 1, col: 0 },
    { row: 0, col: -1 }, { row: 0, col: 1 }
  ];

  for (const dir of straightDirections) {
    let currentPos = { row: position.row + dir.row, col: position.col + dir.col };
    
    while (isValidPosition(currentPos)) {
      const piece = getPieceAtPosition(board, currentPos);
      
      if (piece) {
        if (piece.color === attackingColor && (piece.type === 'rook' || piece.type === 'queen')) {
          return true;
        }
        break;
      }
      
      currentPos = { row: currentPos.row + dir.row, col: currentPos.col + dir.col };
    }
  }

  // Check for bishop/queen attacks (diagonal)
  const diagonalDirections = [
    { row: -1, col: -1 }, { row: -1, col: 1 },
    { row: 1, col: -1 }, { row: 1, col: 1 }
  ];

  for (const dir of diagonalDirections) {
    let currentPos = { row: position.row + dir.row, col: position.col + dir.col };
    
    while (isValidPosition(currentPos)) {
      const piece = getPieceAtPosition(board, currentPos);
      
      if (piece) {
        if (piece.color === attackingColor && (piece.type === 'bishop' || piece.type === 'queen')) {
          return true;
        }
        break;
      }
      
      currentPos = { row: currentPos.row + dir.row, col: currentPos.col + dir.col };
    }
  }

  // Check for king attacks (only adjacent squares)
  const kingMoves = [
    { row: -1, col: -1 }, { row: -1, col: 0 }, { row: -1, col: 1 },
    { row: 0, col: -1 }, { row: 0, col: 1 },
    { row: 1, col: -1 }, { row: 1, col: 0 }, { row: 1, col: 1 }
  ];

  for (const move of kingMoves) {
    const attackPos = { row: position.row + move.row, col: position.col + move.col };
    if (isValidPosition(attackPos)) {
      const piece = getPieceAtPosition(board, attackPos);
      if (piece && piece.type === 'king' && piece.color === attackingColor) {
        return true;
      }
    }
  }

  return false;
};

// Check if the king is in check
export const isInCheck = (board: ChessBoard, kingColor: PieceColor): boolean => {
  const kingPosition = findKingPosition(board, kingColor);
  if (!kingPosition) return false;

  const opponentColor = kingColor === 'white' ? 'black' : 'white';
  return isPositionUnderAttack(board, kingPosition, opponentColor);
};

// Filter moves that would leave the king in check
const filterMovesForCheck = (
  state: ChessGameState,
  fromPosition: ChessPosition,
  possibleMoves: ChessPosition[]
): ChessPosition[] => {
  const currentColor = state.currentTurn;
  return possibleMoves.filter(toPosition => {
    // Create a copy of the board and simulate the move
    const boardCopy = copyBoard(state.board);
    const movingPiece = getPieceAtPosition(boardCopy, fromPosition);
    
    // Make the move on the copy
    boardCopy[toPosition.row][toPosition.col] = movingPiece;
    boardCopy[fromPosition.row][fromPosition.col] = null;
    
    // Check if the king is in check after the move
    return !isInCheck(boardCopy, currentColor);
  });
};

// Make a move on the board and update game state
export const makeMove = (state: ChessGameState, fromPosition: ChessPosition, toPosition: ChessPosition): ChessGameState => {
  const newState = copyGameState(state);
  const piece = getPieceAtPosition(newState.board, fromPosition);
  
  if (!piece) return newState;
  
  const capturedPiece = getPieceAtPosition(newState.board, toPosition);
  
  // Record the move in history
  const move: ChessMove = {
    from: { ...fromPosition },
    to: { ...toPosition },
    piece: { ...piece },
    capturedPiece: capturedPiece ? { ...capturedPiece } : null,
  };

  // Update the pieces' positions
  newState.board[toPosition.row][toPosition.col] = { ...piece, hasMoved: true };
  newState.board[fromPosition.row][fromPosition.col] = null;

  // Switch turns
  newState.currentTurn = newState.currentTurn === 'white' ? 'black' : 'white';
  
  // Clear selection and possible moves
  newState.selectedPosition = null;
  newState.possibleMoves = [];
  
  // Update last move
  newState.lastMove = move;
  newState.moveHistory.push(move);
  
  // Check for check and checkmate
  const opponentKingColor = newState.currentTurn;
  newState.isCheck = isInCheck(newState.board, opponentKingColor);
  
  if (newState.isCheck) {
    move.isCheck = true;
    // Check for checkmate (if all moves for opponent lead to check)
    newState.isCheckmate = isCheckmate(newState);
    move.isCheckmate = newState.isCheckmate;
  } else {
    // Check for stalemate
    newState.isStalemate = isStalemate(newState);
  }
  
  return newState;
};

// Check if the current player is in checkmate
const isCheckmate = (state: ChessGameState): boolean => {
  return hasNoLegalMoves(state) && state.isCheck;
};

// Check if the current player is in stalemate
const isStalemate = (state: ChessGameState): boolean => {
  return hasNoLegalMoves(state) && !state.isCheck;
};

// Check if the current player has any legal moves
const hasNoLegalMoves = (state: ChessGameState): boolean => {
  const currentColor = state.currentTurn;
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = state.board[row][col];
      
      if (piece && piece.color === currentColor) {
        const position = { row, col };
        const moves = getPossibleMoves(state, position);
        
        if (moves.length > 0) {
          return false;
        }
      }
    }
  }
  
  return true;
};

// Get algebraic notation for a position
export const getAlgebraicNotation = (position: ChessPosition): string => {
  const file = String.fromCharCode(97 + position.col); // 'a' to 'h'
  const rank = 8 - position.row; // 1 to 8
  return `${file}${rank}`;
};

// Get algebraic notation for a move
export const getMoveNotation = (move: ChessMove): string => {
  if (move.isCheckmate) {
    return `${getPieceNotation(move.piece.type)}${getAlgebraicNotation(move.from)}${getAlgebraicNotation(move.to)}#`;
  } else if (move.isCheck) {
    return `${getPieceNotation(move.piece.type)}${getAlgebraicNotation(move.from)}${getAlgebraicNotation(move.to)}+`;
  } else {
    return `${getPieceNotation(move.piece.type)}${getAlgebraicNotation(move.from)}${getAlgebraicNotation(move.to)}`;
  }
};

// Get notation for a piece type
const getPieceNotation = (pieceType: PieceType): string => {
  switch (pieceType) {
    case 'king': return 'K';
    case 'queen': return 'Q';
    case 'rook': return 'R';
    case 'bishop': return 'B';
    case 'knight': return 'N';
    case 'pawn': return '';
  }
};

// Computer AI: Make a random valid move for the current player
export const makeComputerMove = (state: ChessGameState): ChessGameState => {
  if (state.currentTurn !== state.computerPlayer || state.isCheckmate || state.isStalemate) {
    return state;
  }

  // Get all pieces of the current player
  const pieces: ChessPosition[] = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = state.board[row][col];
      if (piece && piece.color === state.currentTurn) {
        pieces.push({ row, col });
      }
    }
  }

  // Shuffle the pieces array to randomize move selection
  pieces.sort(() => Math.random() - 0.5);

  // Try to find a valid move
  for (const fromPosition of pieces) {
    const possibleMoves = getPossibleMoves(state, fromPosition);
    
    if (possibleMoves.length > 0) {
      // Shuffle possible moves to get a random one
      possibleMoves.sort(() => Math.random() - 0.5);
      
      // Make the move
      return makeMove(state, fromPosition, possibleMoves[0]);
    }
  }

  // No valid moves found (should not happen as we already check for checkmate/stalemate)
  return state;
};

// Toggle board orientation
export const flipBoard = (state: ChessGameState): ChessGameState => {
  const newState = copyGameState(state);
  newState.boardOrientation = state.boardOrientation === 'white' ? 'black' : 'white';
  return newState;
};

// Toggle computer player
export const toggleComputerPlayer = (state: ChessGameState): ChessGameState => {
  const newState = copyGameState(state);
  newState.computerPlayer = state.computerPlayer === 'black' ? 'white' : 
                           (state.computerPlayer === 'white' ? null : 'black');
  return newState;
};
