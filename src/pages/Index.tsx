
import React, { useState } from 'react';
import ChessBoard from '@/components/ChessBoard';
import MoveHistory from '@/components/MoveHistory';
import GameStatus from '@/components/GameStatus';
import { initializeGameState, getPossibleMoves, makeMove } from '@/utils/chessUtils';
import { ChessGameState, ChessPosition } from '@/types/chess';
import { toast } from 'sonner';

const Index = () => {
  const [gameState, setGameState] = useState<ChessGameState>(initializeGameState());

  // Handle square click (select piece or make move)
  const handleSquareClick = (position: ChessPosition) => {
    const { board, currentTurn, selectedPosition, possibleMoves } = gameState;
    const piece = board[position.row][position.col];

    // If a position is already selected
    if (selectedPosition) {
      // If clicking on the same square, deselect it
      if (selectedPosition.row === position.row && selectedPosition.col === position.col) {
        setGameState({
          ...gameState,
          selectedPosition: null,
          possibleMoves: []
        });
        return;
      }

      // Check if clicked position is a valid move
      const isMoveValid = possibleMoves.some(
        move => move.row === position.row && move.col === position.col
      );

      if (isMoveValid) {
        // Make the move
        const newGameState = makeMove(gameState, selectedPosition, position);
        setGameState(newGameState);
        
        // Show notifications for special game states
        if (newGameState.isCheckmate) {
          toast.success(`Checkmate! ${currentTurn === 'white' ? 'Black' : 'White'} wins!`);
        } else if (newGameState.isCheck) {
          toast.info(`${newGameState.currentTurn === 'white' ? 'White' : 'Black'} is in check!`);
        } else if (newGameState.isStalemate) {
          toast.info("Stalemate! The game is a draw.");
        }
      } else if (piece && piece.color === currentTurn) {
        // If clicking on another own piece, select that piece instead
        const newPossibleMoves = getPossibleMoves(gameState, position);
        setGameState({
          ...gameState,
          selectedPosition: position,
          possibleMoves: newPossibleMoves
        });
      } else {
        // Invalid move, deselect
        setGameState({
          ...gameState,
          selectedPosition: null,
          possibleMoves: []
        });
        toast.error("Invalid move!");
      }
    } else {
      // No piece selected yet
      if (piece && piece.color === currentTurn) {
        // Select the piece and calculate possible moves
        const possibleMoves = getPossibleMoves(gameState, position);
        setGameState({
          ...gameState,
          selectedPosition: position,
          possibleMoves
        });
      }
    }
  };

  // Reset the game
  const handleReset = () => {
    setGameState(initializeGameState());
    toast.success("New game started!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Chess Kings Conquer</h1>
          <p className="text-gray-500">A classic game of strategy and skill</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex justify-center">
            <ChessBoard gameState={gameState} onSquareClick={handleSquareClick} />
          </div>
          
          <div className="space-y-4">
            <GameStatus gameState={gameState} onReset={handleReset} />
            <MoveHistory moves={gameState.moveHistory} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
