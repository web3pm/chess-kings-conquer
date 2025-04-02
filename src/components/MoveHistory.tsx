
import React from 'react';
import { ChessMove } from '@/types/chess';
import { getMoveNotation } from '@/utils/chessUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface MoveHistoryProps {
  moves: ChessMove[];
}

const MoveHistory: React.FC<MoveHistoryProps> = ({ moves }) => {
  // Group moves by pairs (white and black)
  const groupedMoves = [];
  for (let i = 0; i < moves.length; i += 2) {
    groupedMoves.push({
      number: Math.floor(i / 2) + 1,
      white: moves[i],
      black: i + 1 < moves.length ? moves[i + 1] : null
    });
  }

  const downloadMoveHistory = () => {
    // Create CSV content
    let csvContent = "Move,White,Black\n";
    
    groupedMoves.forEach(({ number, white, black }) => {
      csvContent += `${number},${getMoveNotation(white)},${black ? getMoveNotation(black) : ""}\n`;
    });
    
    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'chess_move_history.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader className="p-3 pb-0 flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Move History</CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={downloadMoveHistory}
          className="gap-1"
          disabled={moves.length === 0}
          title="Download move history as CSV"
        >
          <Download size={16} />
          <span className="hidden sm:inline">Download CSV</span>
        </Button>
      </CardHeader>
      <CardContent className="p-3">
        <ScrollArea className="h-72 pr-3">
          <div className="space-y-1">
            {groupedMoves.length === 0 ? (
              <p className="text-gray-500 italic text-center">No moves played yet</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left font-semibold">#</th>
                    <th className="text-left font-semibold">White</th>
                    <th className="text-left font-semibold">Black</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedMoves.map(({ number, white, black }) => (
                    <tr key={number} className="border-b border-gray-100 last:border-0">
                      <td className="py-1 text-gray-500">{number}.</td>
                      <td className="py-1 font-mono">{getMoveNotation(white)}</td>
                      <td className="py-1 font-mono">{black ? getMoveNotation(black) : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default MoveHistory;
