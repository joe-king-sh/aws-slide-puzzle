import type { FC } from 'react';
import '../styles/PuzzleBoard.css';
import PuzzlePiece from './PuzzlePiece';

interface PuzzleBoardProps {
  size: number;
  board: number[];
  emptyIndex: number;
  onPieceClick: (index: number) => void;
  isCompleted: boolean;
  imagePieces: string[];
  imageLoaded: boolean;
}

const PuzzleBoard: FC<PuzzleBoardProps> = ({ 
  size, 
  board, 
  emptyIndex, 
  onPieceClick,
  isCompleted,
  imagePieces,
  imageLoaded
}) => {
  return (
    <div 
      className="puzzle-board"
      style={{ 
        gridTemplateColumns: `repeat(${size}, 1fr)`,
        gridTemplateRows: `repeat(${size}, 1fr)`
      }}
    >
      {board.map((value, index) => (
        <PuzzlePiece
          key={value}
          value={value}
          index={index}
          size={size}
          isMovable={isAdjacent(index, emptyIndex, size)}
          isEmpty={value === size * size - 1}
          onClick={() => onPieceClick(index)}
          isCompleted={isCompleted}
          imagePieces={imagePieces}
          imageLoaded={imageLoaded}
        />
      ))}
    </div>
  );
};

// 隣接しているかどうかを判定する関数
const isAdjacent = (index: number, emptyIndex: number, size: number): boolean => {
  // 上下左右に隣接しているかチェック
  const row = Math.floor(index / size);
  const col = index % size;
  const emptyRow = Math.floor(emptyIndex / size);
  const emptyCol = emptyIndex % size;
  
  return (
    (row === emptyRow && Math.abs(col - emptyCol) === 1) || // 左右に隣接
    (col === emptyCol && Math.abs(row - emptyRow) === 1)    // 上下に隣接
  );
};

export default PuzzleBoard;
