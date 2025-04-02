
import React from 'react';
import { ChessPiece as ChessPieceType, ChessPosition } from '@/types/chess';
import ChessPiece from './ChessPiece';

interface ChessSquareProps {
  position: ChessPosition;
  piece: ChessPieceType | null;
  isLight: boolean;
  isSelected: boolean;
  isPossibleMove: boolean;
  isPossibleCapture: boolean;
  isLastMove: boolean;
  isCheck: boolean;
  onClick: (position: ChessPosition) => void;
}

const ChessSquare: React.FC<ChessSquareProps> = ({
  position,
  piece,
  isLight,
  isSelected,
  isPossibleMove,
  isPossibleCapture,
  isLastMove,
  isCheck,
  onClick,
}) => {
  // Determine square background color
  const getSquareClasses = (): string => {
    let classes = 'w-full h-full flex items-center justify-center relative';
    
    // Base color
    classes += isLight ? ' bg-chess-light' : ' bg-chess-dark';

    // Special states (in order of priority)
    if (isSelected) {
      classes += ' ring-2 ring-inset ring-indigo-500';
    }
    
    if (isCheck) {
      classes += ' bg-chess-check';
    } else if (isLastMove) {
      classes += ' bg-chess-last-move';
    }
    
    return classes;
  };

  return (
    <div 
      className={getSquareClasses()}
      onClick={() => onClick(position)}
    >
      {/* The chess piece */}
      {piece && <ChessPiece piece={piece} isSelected={isSelected} />}
      
      {/* Possible move indicator */}
      {isPossibleMove && !piece && (
        <div className="absolute h-3 w-3 rounded-full bg-chess-possible-move"></div>
      )}
      
      {/* Possible capture indicator */}
      {isPossibleCapture && piece && (
        <div className="absolute inset-0 border-2 border-chess-possible-capture rounded-sm"></div>
      )}
    </div>
  );
};

export default ChessSquare;
