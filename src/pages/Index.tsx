
import React, { useState, useEffect } from 'react';
import ChessBoard from '@/components/ChessBoard';
import MoveHistory from '@/components/MoveHistory';
import GameStatus from '@/components/GameStatus';
import { initializeGameState, getPossibleMoves, makeMove, makeComputerMove, flipBoard, toggleComputerPlayer } from '@/utils/chessUtils';
import { ChessGameState, ChessPosition } from '@/types/chess';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { RefreshCw, RotateCw, Cpu } from 'lucide-react';

const Index = () => {
  const [gameState, setGameState] = useState<ChessGameState>(initializeGameState());

  // Handle computer moves
  useEffect(() => {
    if (gameState.computerPlayer === gameState.currentTurn && 
        !gameState.isCheckmate && 
        !gameState.isStalemate) {
      // Add a small delay to make the computer move look more natural
      const timerId = setTimeout(() => {
        const newState = makeComputerMove(gameState);
        setGameState(newState);
      }, 500);

      return () => clearTimeout(timerId);
    }
  }, [gameState.currentTurn, gameState.computerPlayer, gameState.isCheckmate, gameState.isStalemate]);

  // Handle square click (select piece or make move)
  const handleSquareClick = (position: ChessPosition) => {
    // If it's the computer's turn, don't allow human moves
    if (gameState.computerPlayer === gameState.currentTurn) {
      toast.error("It's the computer's turn!");
      return;
    }

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

  // Flip the board
  const handleFlipBoard = () => {
    setGameState(flipBoard(gameState));
    toast.info(`Board flipped! ${gameState.boardOrientation === 'white' ? 'Black' : 'White'} is now at the bottom.`);
  };

  // Toggle computer player
  const handleToggleComputer = () => {
    const newState = toggleComputerPlayer(gameState);
    setGameState(newState);
    
    if (newState.computerPlayer === null) {
      toast.info("Computer player disabled. Playing human vs human.");
    } else {
      toast.info(`Computer now plays as ${newState.computerPlayer}.`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Chess Kings Conquer</h1>
          <p className="text-gray-500">A classic game of strategy and skill</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col justify-center items-center">
            <div className="flex gap-2 mb-4">
              <Button variant="outline" size="sm" onClick={handleFlipBoard} className="gap-1">
                <RotateCw className="h-4 w-4" />
                Flip Board
              </Button>
              <Button variant="outline" size="sm" onClick={handleToggleComputer} className="gap-1">
                <Cpu className="h-4 w-4" />
                {gameState.computerPlayer === null ? "Enable Computer" : 
                 gameState.computerPlayer === 'white' ? "Computer: White" : "Computer: Black"}
              </Button>
            </div>
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
