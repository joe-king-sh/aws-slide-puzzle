import { useState, useEffect, useCallback } from 'react';

interface UsePuzzleReturn {
  board: number[];
  emptyIndex: number;
  moves: number;
  size: number;
  isCompleted: boolean;
  handlePieceClick: (index: number) => boolean;
  setSize: (newSize: number) => void;
  resetPuzzle: () => void;
}

export const usePuzzle = (initialSize: number = 3): UsePuzzleReturn => {
  const [size, setSize] = useState<number>(initialSize);
  const [board, setBoard] = useState<number[]>([]);
  const [emptyIndex, setEmptyIndex] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // パズルの初期化
  const initializeBoard = useCallback(() => {
    const totalPieces = size * size;
    const newBoard = Array.from({ length: totalPieces }, (_, i) => i);
    setBoard(newBoard);
    setEmptyIndex(totalPieces - 1);
    setMoves(0);
    setIsCompleted(false);
  }, [size]);

  // パズルのシャッフル
  const shuffleBoard = useCallback(() => {
    const totalPieces = size * size;
    const newBoard = Array.from({ length: totalPieces }, (_, i) => i);
    let newEmptyIndex = totalPieces - 1;
    
    // シャッフル（ランダムな有効な移動を複数回行う）
    const shuffleMoves = size * size * 20; // シャッフルの回数
    
    for (let i = 0; i < shuffleMoves; i++) {
      const possibleMoves = getAdjacentIndices(newEmptyIndex, size);
      if (possibleMoves.length > 0) {
        // ランダムに隣接するピースを選択
        const randomIndex = Math.floor(Math.random() * possibleMoves.length);
        const pieceToMove = possibleMoves[randomIndex];
        
        // ピースを移動
        [newBoard[newEmptyIndex], newBoard[pieceToMove]] = [newBoard[pieceToMove], newBoard[newEmptyIndex]];
        newEmptyIndex = pieceToMove;
      }
    }
    
    setBoard(newBoard);
    setEmptyIndex(newEmptyIndex);
    setMoves(0);
    setIsCompleted(false);
  }, [size]);

  // パズルのリセット
  const resetPuzzle = useCallback(() => {
    initializeBoard();
    setTimeout(() => {
      shuffleBoard();
    }, 300);
  }, [initializeBoard, shuffleBoard]);

  // サイズ変更時の処理
  const handleSizeChange = useCallback((newSize: number) => {
    setSize(newSize);
  }, []);

  // ピースクリック時の処理
  const handlePieceClick = useCallback((index: number) => {
    if (isCompleted) return false;
    
    // 空白と隣接しているかチェック
    if (!isAdjacent(index, emptyIndex, size)) return false;
    
    // ピースを移動
    const newBoard = [...board];
    [newBoard[index], newBoard[emptyIndex]] = [newBoard[emptyIndex], newBoard[index]];
    
    setBoard(newBoard);
    setEmptyIndex(index);
    setMoves(moves + 1);
    
    // 完成したかチェック
    checkCompletion(newBoard);
    
    return true; // 移動が成功したことを返す
  }, [board, emptyIndex, size, moves, isCompleted]);

  // 完成チェック
  const checkCompletion = useCallback((currentBoard: number[]) => {
    const isSolved = currentBoard.every((value, index) => {
      return value === index;
    });
    
    if (isSolved) {
      setIsCompleted(true);
    }
  }, []);

  // サイズ変更時にボードを初期化
  useEffect(() => {
    resetPuzzle();
  }, [size, resetPuzzle]);

  return {
    board,
    emptyIndex,
    moves,
    size,
    isCompleted,
    handlePieceClick,
    setSize: handleSizeChange,
    resetPuzzle
  };
};

// 隣接するインデックスを取得する関数
const getAdjacentIndices = (index: number, size: number): number[] => {
  const row = Math.floor(index / size);
  const col = index % size;
  const adjacent: number[] = [];
  
  // 上
  if (row > 0) adjacent.push(index - size);
  // 下
  if (row < size - 1) adjacent.push(index + size);
  // 左
  if (col > 0) adjacent.push(index - 1);
  // 右
  if (col < size - 1) adjacent.push(index + 1);
  
  return adjacent;
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
