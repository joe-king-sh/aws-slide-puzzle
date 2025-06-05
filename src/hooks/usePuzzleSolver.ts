import { useState, useCallback } from 'react';

interface PuzzleState {
  board: number[];
  emptyIndex: number;
  moves: number;
  path: number[];
}

interface SolverResult {
  solution: number[];
  totalMoves: number;
  isValid: boolean;
}

export const usePuzzleSolver = () => {
  const [isSolving, setIsSolving] = useState(false);

  // マンハッタン距離を計算するヒューリスティック関数
  const calculateManhattanDistance = useCallback((board: number[], size: number): number => {
    let distance = 0;
    for (let i = 0; i < board.length; i++) {
      if (board[i] !== 0) {
        const currentRow = Math.floor(i / size);
        const currentCol = i % size;
        const targetRow = Math.floor(board[i] / size);
        const targetCol = board[i] % size;
        distance += Math.abs(currentRow - targetRow) + Math.abs(currentCol - targetCol);
      }
    }
    return distance;
  }, []);

  // 隣接するインデックスを取得
  const getAdjacentIndices = useCallback((index: number, size: number): number[] => {
    const row = Math.floor(index / size);
    const col = index % size;
    const adjacent: number[] = [];
    
    if (row > 0) adjacent.push(index - size);
    if (row < size - 1) adjacent.push(index + size);
    if (col > 0) adjacent.push(index - 1);
    if (col < size - 1) adjacent.push(index + 1);
    
    return adjacent;
  }, []);

  // ボードの状態をハッシュ化
  const getBoardHash = useCallback((board: number[]): string => {
    return board.join(',');
  }, []);

  // ボードの完成をチェック
  const isCompleted = useCallback((board: number[]): boolean => {
    return board.every((value, index) => value === index);
  }, []);

  // パズルが解決可能かチェック（逆転数を計算）
  const isSolvable = useCallback((board: number[], size: number): boolean => {
    const emptyIndex = board.indexOf(0);
    const emptyRow = Math.floor(emptyIndex / size);
    
    // 0を除いた配列で逆転数を計算
    const nonEmptyBoard = board.filter(val => val !== 0);
    let inversions = 0;
    
    for (let i = 0; i < nonEmptyBoard.length; i++) {
      for (let j = i + 1; j < nonEmptyBoard.length; j++) {
        if (nonEmptyBoard[i] > nonEmptyBoard[j]) {
          inversions++;
        }
      }
    }
    
    if (size % 2 === 1) {
      // 奇数サイズの場合：逆転数が偶数なら解決可能
      return inversions % 2 === 0;
    } else {
      // 偶数サイズの場合：空白が偶数行にあるなら逆転数が奇数、奇数行にあるなら逆転数が偶数
      return (emptyRow % 2 === 0) ? (inversions % 2 === 1) : (inversions % 2 === 0);
    }
  }, []);

  // A*アルゴリズムを使ってパズルを解く
  const solvePuzzle = useCallback(async (
    initialBoard: number[],
    size: number,
    onProgressUpdate?: (progress: number) => void
  ): Promise<SolverResult> => {
    if (isCompleted(initialBoard)) {
      return { solution: [], totalMoves: 0, isValid: true };
    }

    if (!isSolvable(initialBoard, size)) {
      return { solution: [], totalMoves: 0, isValid: false };
    }

    setIsSolving(true);

    const initialEmptyIndex = initialBoard.indexOf(0);
    const initialState: PuzzleState = {
      board: [...initialBoard],
      emptyIndex: initialEmptyIndex,
      moves: 0,
      path: []
    };

    // 優先度付きキューの代わりに配列を使用（単純化）
    const openSet: Array<{
      state: PuzzleState;
      fScore: number;
      gScore: number;
    }> = [{
      state: initialState,
      fScore: calculateManhattanDistance(initialBoard, size),
      gScore: 0
    }];

    const visited = new Set<string>();
    const maxIterations = size === 3 ? 100000 : size === 4 ? 50000 : 20000;
    let iterations = 0;

    while (openSet.length > 0 && iterations < maxIterations) {
      iterations++;
      
      if (iterations % 1000 === 0 && onProgressUpdate) {
        onProgressUpdate(Math.min(90, (iterations / maxIterations) * 100));
      }

      // f値が最小のノードを選択
      openSet.sort((a, b) => a.fScore - b.fScore);
      const current = openSet.shift()!;
      
      const boardHash = getBoardHash(current.state.board);
      if (visited.has(boardHash)) continue;
      visited.add(boardHash);

      if (isCompleted(current.state.board)) {
        setIsSolving(false);
        if (onProgressUpdate) onProgressUpdate(100);
        return {
          solution: current.state.path,
          totalMoves: current.state.moves,
          isValid: true
        };
      }

      // 隣接する状態を生成
      const adjacentIndices = getAdjacentIndices(current.state.emptyIndex, size);
      
      for (const adjacentIndex of adjacentIndices) {
        const newBoard = [...current.state.board];
        [newBoard[current.state.emptyIndex], newBoard[adjacentIndex]] = 
        [newBoard[adjacentIndex], newBoard[current.state.emptyIndex]];
        
        const newBoardHash = getBoardHash(newBoard);
        if (visited.has(newBoardHash)) continue;

        const newState: PuzzleState = {
          board: newBoard,
          emptyIndex: adjacentIndex,
          moves: current.state.moves + 1,
          path: [...current.state.path, adjacentIndex]
        };

        const gScore = current.gScore + 1;
        const hScore = calculateManhattanDistance(newBoard, size);
        const fScore = gScore + hScore;

        openSet.push({
          state: newState,
          fScore,
          gScore
        });
      }
    }

    setIsSolving(false);
    // 解が見つからない場合（タイムアウト）
    return { solution: [], totalMoves: 0, isValid: false };
  }, [calculateManhattanDistance, getAdjacentIndices, getBoardHash, isCompleted, isSolvable]);

  return {
    solvePuzzle,
    isSolving
  };
};