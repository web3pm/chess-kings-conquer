
import React from 'react';
import { ChessPiece as ChessPieceType } from '@/types/chess';

interface ChessPieceProps {
  piece: ChessPieceType;
  isSelected?: boolean;
}

const ChessPiece: React.FC<ChessPieceProps> = ({ piece, isSelected = false }) => {
  const getPieceEmoji = (piece: ChessPieceType): string => {
    const { type, color } = piece;
    
    switch (type) {
      case 'king':
        return color === 'white' ? '👑' : '👑';
      case 'queen':
        return color === 'white' ? '👸' : '👸';
      case 'rook':
        return color === 'white' ? '🏰' : '🏰';
      case 'bishop':
        return color === 'white' ? '⛪' : '⛪';
      case 'knight':
        return color === 'white' ? '🐴' : '🐴';
      case 'pawn':
        return color === 'white' ? '👤' : '👤';
      default:
        return '';
    }
  };

  return (
    <div 
      className={`
        flex items-center justify-center text-4xl select-none
        transition-all duration-200 
        ${isSelected ? 'animate-piece-select' : ''}
        ${piece.color === 'white' ? 'text-white drop-shadow-md' : 'text-black drop-shadow-md'}
      `}
    >
      {getPieceEmoji(piece)}
    </div>
  );
};

export default ChessPiece;
