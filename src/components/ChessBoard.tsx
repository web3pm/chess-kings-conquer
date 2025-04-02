
import React from 'react';
import ChessSquare from './ChessSquare';
import { ChessGameState, ChessPosition } from '@/types/chess';
import { findKingPosition, isSamePosition, positionInArray } from '@/utils/chessUtils';

interface ChessBoardProps {
  gameState: ChessGameState;
  onSquareClick: (position: ChessPosition) => void;
}

const ChessBoard: React.FC<ChessBoardProps> = ({ gameState, onSquareClick }) => {
  const { board, selectedPosition, possibleMoves, lastMove, isCheck, currentTurn, boardOrientation } = gameState;

  // Check if a position is part of the last move
  const isPartOfLastMove = (position: ChessPosition): boolean => {
    if (!lastMove) return false;
    return (
      isSamePosition(position, lastMove.from) || 
      isSamePosition(position, lastMove.to)
    );
  };

  // Check if a position contains a king in check
  const isKingInCheck = (position: ChessPosition): boolean => {
    if (!isCheck) return false;
    
    const kingPosition = findKingPosition(board, currentTurn);
    return kingPosition ? isSamePosition(position, kingPosition) : false;
  };

  // Creates the rows array in the correct order based on orientation
  const getRows = () => {
    let rowIndices = Array(8).fill(null).map((_, i) => i);
    if (boardOrientation === 'black') {
      rowIndices = rowIndices.reverse();
    }
    return rowIndices;
  };

  // Creates the columns array in the correct order based on orientation
  const getCols = () => {
    let colIndices = Array(8).fill(null).map((_, i) => i);
    if (boardOrientation === 'black') {
      colIndices = colIndices.reverse();
    }
    return colIndices;
  };

  const rows = getRows();
  const cols = getCols();
  const files = boardOrientation === 'white' 
    ? ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] 
    : ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'];
  const ranks = boardOrientation === 'white'
    ? ['1', '2', '3', '4', '5', '6', '7', '8'].reverse()
    : ['8', '7', '6', '5', '4', '3', '2', '1'].reverse();

  // Render the board with coordinates
  return (
    <div className="relative flex flex-col items-center">
      <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl aspect-square border-4 border-chess-wood-dark rounded shadow-lg">
        <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
          {/* Render each square */}
          {rows.map((row, rowIndex) => (
            cols.map((col, colIndex) => {
              const position: ChessPosition = { row, col };
              const piece = board[row][col];
              const isLight = (row + col) % 2 === 1;
              const isSelected = selectedPosition ? isSamePosition(position, selectedPosition) : false;
              const isPossibleMove = positionInArray(position, possibleMoves) && !piece;
              const isPossibleCapture = positionInArray(position, possibleMoves) && !!piece;
              const partOfLastMove = isPartOfLastMove(position);
              const kingInCheck = isKingInCheck(position);

              return (
                <ChessSquare
                  key={`${row}-${col}`}
                  position={position}
                  piece={piece}
                  isLight={isLight}
                  isSelected={isSelected}
                  isPossibleMove={isPossibleMove}
                  isPossibleCapture={isPossibleCapture}
                  isLastMove={partOfLastMove}
                  isCheck={kingInCheck}
                  onClick={onSquareClick}
                />
              );
            })
          ))}
        </div>
      </div>
      
      {/* File indicators (a-h) */}
      <div className="grid grid-cols-8 w-full max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl px-1 mt-1">
        {files.map((file, index) => (
          <div key={file} className="text-center text-sm font-semibold">
            {file}
          </div>
        ))}
      </div>
      
      {/* Rank indicators (1-8) */}
      <div className="absolute left-0 top-0 h-full flex flex-col-reverse justify-around -ml-6">
        {ranks.map((rank, index) => (
          <div key={rank} className="text-sm font-semibold">
            {rank}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChessBoard;
