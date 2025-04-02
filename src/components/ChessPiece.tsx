
import React from 'react';
import { ChessPiece as ChessPieceType } from '@/types/chess';

interface ChessPieceProps {
  piece: ChessPieceType;
  isSelected?: boolean;
}

const ChessPiece: React.FC<ChessPieceProps> = ({ piece, isSelected = false }) => {
  const getPieceSymbol = (piece: ChessPieceType): string => {
    const { type, color } = piece;
    
    switch (type) {
      case 'king':
        return color === 'black' ? '♔' : '♚';
      case 'queen':
        return color === 'black' ? '♕' : '♛';
      case 'rook':
        return color === 'black' ? '♖' : '♜';
      case 'bishop':
        return color === 'black' ? '♗' : '♝';
      case 'knight':
        return color === 'black' ? '♘' : '♞';
      case 'pawn':
        return color === 'black' ? '♙' : '♟';
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
        ${piece.color === 'black' ? 'text-white drop-shadow-md' : 'text-black drop-shadow-md'}
      `}
    >
      {getPieceSymbol(piece)}
    </div>
  );
};

export default ChessPiece;
