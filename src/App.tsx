import { useState, useEffect } from 'react';
import './App.css';
import './styles/variables.css';
import PuzzleBoard from './components/PuzzleBoard';
import Controls from './components/Controls';
import { usePuzzle } from './hooks/usePuzzle';
import { useImageSplitter } from './hooks/useImageSplitter';
import amazonQImage from './assets/images/amazon-q.png';
import moveSound from './assets/sounds/move.mp3';
import completeSound from './assets/sounds/complete.mp3';
import confetti from 'canvas-confetti';

function App() {
  const [initialSize] = useState(3);
  const {
    board,
    emptyIndex,
    moves,
    size,
    isCompleted,
    handlePieceClick,
    setSize,
    resetPuzzle
  } = usePuzzle(initialSize);

  // 画像分割フックを使用
  const { pieces, loaded } = useImageSplitter(amazonQImage, size);

  // 効果音の設定
  const [moveSoundObj, setMoveSoundObj] = useState<HTMLAudioElement | null>(null);
  const [completeSoundObj, setCompleteSoundObj] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    // 効果音の読み込み
    const moveSoundElement = new Audio(moveSound);
    const completeSoundElement = new Audio(completeSound);
    
    setMoveSoundObj(moveSoundElement);
    setCompleteSoundObj(completeSoundElement);
    
    return () => {
      // クリーンアップ
      moveSoundElement.pause();
      completeSoundElement.pause();
    };
  }, []);

  // 完成時の効果音と紙吹雪
  useEffect(() => {
    if (isCompleted) {
      // 効果音を再生
      if (completeSoundObj) {
        completeSoundObj.currentTime = 0;
        completeSoundObj.play().catch(error => console.error('Failed to play sound effect:', error));
      }
      
      // 紙吹雪を表示
      const duration = 3000; // 3秒間
      const animationEnd = Date.now() + duration;
      const colors = ['#ED7100', '#161D26', '#FF9900', '#FFFFFF', '#232F3E'];
      
      const frame = () => {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        });
        
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        });
        
        if (Date.now() < animationEnd) {
          requestAnimationFrame(frame);
        }
      };
      
      frame();
    }
  }, [isCompleted, completeSoundObj]);

  // ピースクリック時の効果音
  const handlePieceClickWithSound = (index: number) => {
    const wasSuccessfulMove = handlePieceClick(index);
    if (wasSuccessfulMove && moveSoundObj) {
      moveSoundObj.currentTime = 0;
      moveSoundObj.play().catch(error => console.error('Failed to play sound effect:', error));
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Amazon Q Slide Puzzle</h1>
        <p>Move the pieces to restore the original image!</p>
      </header>
      
      <main className="app-main">
        <div className="puzzle-container">
          <Controls
            size={size}
            moves={moves}
            onSizeChange={setSize}
            onReset={resetPuzzle}
            isCompleted={isCompleted}
          />
          
          <PuzzleBoard
            size={size}
            board={board}
            emptyIndex={emptyIndex}
            onPieceClick={handlePieceClickWithSound}
            isCompleted={isCompleted}
            imagePieces={pieces}
            imageLoaded={loaded}
          />
        </div>
      </main>
      
      <footer className="app-footer">
        <p>Powered by Amazon Q</p>
      </footer>
    </div>
  );
}

export default App;
