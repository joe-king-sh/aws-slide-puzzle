import { FC } from 'react';
import '../styles/PuzzleBoard.css';

interface PuzzlePieceProps {
  value: number;
  index: number;
  size: number;
  isMovable: boolean;
  isEmpty: boolean;
  onClick: () => void;
  isCompleted: boolean;
  imagePieces: string[];
  imageLoaded: boolean;
}

const PuzzlePiece: FC<PuzzlePieceProps> = ({
  value,
  index,
  size,
  isMovable,
  isEmpty,
  onClick,
  isCompleted,
  imagePieces,
  imageLoaded
}) => {
  return (
    <div
      className={`puzzle-piece ${isMovable ? 'movable' : ''} ${isEmpty ? 'empty' : ''} ${isCompleted ? 'completed' : ''}`}
      onClick={isMovable ? onClick : undefined}
    >
      {!isEmpty && imageLoaded && imagePieces.length > value && (
        <img 
          src={imagePieces[value]} 
          alt={`Piece ${value + 1}`} 
          className="piece-image"
        />
      )}
      {!isEmpty && <span className="piece-number">{value + 1}</span>}
    </div>
  );
};

export default PuzzlePiece;
