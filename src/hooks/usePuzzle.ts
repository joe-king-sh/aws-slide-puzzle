import { useState, useEffect, useCallback } from 'react';
import { usePuzzleSolver } from './usePuzzleSolver';

interface UsePuzzleReturn {
  board: number[];
  emptyIndex: number;
  moves: number;
  size: number;
  isCompleted: boolean;
  isSolving: boolean;
  solverProgress: number;
  handlePieceClick: (index: number) => boolean;
  setSize: (newSize: number) => void;
  resetPuzzle: () => void;
  autoSolvePuzzle: () => void;
}

export const usePuzzle = (initialSize: number = 3): UsePuzzleReturn => {
  const [size, setSize] = useState<number>(initialSize);
  const [board, setBoard] = useState<number[]>([]);
  const [emptyIndex, setEmptyIndex] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [solverProgress, setSolverProgress] = useState<number>(0);

  const { solvePuzzle, isSolving } = usePuzzleSolver();

  // パズルの初期化
  const initializeBoard = useCallback(() => {
    const totalPieces = size * size;
    const newBoard = Array.from({ length: totalPieces }, (_, i) => i);
    setBoard(newBoard);
    setEmptyIndex(totalPieces - 1);
    setMoves(0);
    setIsCompleted(false);
    setSolverProgress(0);
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
    setSolverProgress(0);
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
    if (isCompleted || isSolving) return false;
    
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
  }, [board, emptyIndex, size, moves, isCompleted, isSolving]);

  // 自動解決機能
  const autoSolvePuzzle = useCallback(async () => {
    if (isCompleted || isSolving) return;

    setSolverProgress(0);
    
    try {
      const result = await solvePuzzle(board, size, (progress: number) => {
        setSolverProgress(progress);
      });

      if (result.isValid && result.solution.length > 0) {
        // 解決手順を順番に実行
        for (let i = 0; i < result.solution.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 300)); // 300ms間隔で実行
          
          const moveIndex = result.solution[i];
          setBoard((prevBoard: number[]) => {
            const newBoard = [...prevBoard];
            const currentEmptyIndex = newBoard.indexOf(0);
            [newBoard[currentEmptyIndex], newBoard[moveIndex]] = [newBoard[moveIndex], newBoard[currentEmptyIndex]];
            return newBoard;
          });
          
          setEmptyIndex(result.solution[i]);
          setMoves((prevMoves: number) => prevMoves + 1);
        }
        
        // 最終チェック
        setTimeout(() => {
          setBoard((currentBoard: number[]) => {
            checkCompletion(currentBoard);
            return currentBoard;
          });
        }, 100);
        
      } else if (!result.isValid) {
        console.warn('このパズルは解決できません');
      } else {
        console.warn('解決策が見つかりませんでした');
      }
    } catch (error) {
      console.error('自動解決中にエラーが発生しました:', error);
    } finally {
      setSolverProgress(0);
    }
  }, [board, size, isCompleted, isSolving, solvePuzzle]);

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
    isSolving,
    solverProgress,
    handlePieceClick,
    setSize: handleSizeChange,
    resetPuzzle,
    autoSolvePuzzle
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
