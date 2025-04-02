
import React from 'react';
import { ChessGameState } from '@/types/chess';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, RotateCcw } from 'lucide-react';

interface GameStatusProps {
  gameState: ChessGameState;
  onReset: () => void;
}

const GameStatus: React.FC<GameStatusProps> = ({ gameState, onReset }) => {
  const { currentTurn, isCheck, isCheckmate, isStalemate } = gameState;

  const getStatusMessage = (): string => {
    if (isCheckmate) {
      const winner = currentTurn === 'white' ? 'Black' : 'White';
      return `Checkmate! ${winner} wins!`;
    }
    
    if (isStalemate) {
      return 'Stalemate! The game is a draw.';
    }
    
    if (isCheck) {
      return `${currentTurn === 'white' ? 'White' : 'Black'} is in check!`;
    }
    
    return `${currentTurn === 'white' ? 'White' : 'Black'} to move`;
  };

  return (
    <Card className="w-full bg-white shadow-md">
      <CardContent className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div 
            className={`w-4 h-4 rounded-full ${
              currentTurn === 'white' ? 'bg-white border border-gray-400' : 'bg-black'
            }`} 
          />
          <span className={`font-semibold ${isCheckmate || isStalemate ? 'text-red-500' : ''}`}>
            {getStatusMessage()}
          </span>
          {currentTurn === 'white' && !isCheckmate && !isStalemate && (
            <ArrowRight className="h-4 w-4 text-gray-500" />
          )}
        </div>
        <Button variant="outline" size="sm" onClick={onReset} className="gap-1">
          <RotateCcw className="h-4 w-4" />
          New Game
        </Button>
      </CardContent>
    </Card>
  );
};

export default GameStatus;
