import type { FC } from 'react';
import '../styles/Controls.css';

interface ControlsProps {
  size: number;
  moves: number;
  onSizeChange: (size: number) => void;
  onReset: () => void;
  onAutoSolve: () => void;
  isCompleted: boolean;
  isSolving: boolean;
  solverProgress: number;
}

const Controls: FC<ControlsProps> = ({
  size,
  moves,
  onSizeChange,
  onReset,
  onAutoSolve,
  isCompleted,
  isSolving,
  solverProgress
}) => {
  const sizeOptions = [3, 4, 5];
  
  return (
    <div className="controls">
      <div className="control-group">
        <label htmlFor="puzzle-size">Puzzle Size:</label>
        <select
          id="puzzle-size"
          value={size}
          onChange={(e) => onSizeChange(Number(e.target.value))}
          disabled={isCompleted || isSolving}
        >
          {sizeOptions.map((option) => (
            <option key={option} value={option}>
              {option} x {option}
            </option>
          ))}
        </select>
      </div>
      
      <div className="control-group">
        <span className="moves-counter">Moves: {moves}</span>
      </div>
      
      <div className="control-group">
        <button 
          className="reset-button" 
          onClick={onReset}
          disabled={isSolving}
        >
          Reset
        </button>
        
        <button 
          className="auto-solve-button" 
          onClick={onAutoSolve}
          disabled={isCompleted || isSolving}
        >
          {isSolving ? 'Solving...' : 'Auto Solve'}
        </button>
      </div>
      
      {isSolving && (
        <div className="solver-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${solverProgress}%` }}
            />
          </div>
          <span className="progress-text">{Math.round(solverProgress)}%</span>
        </div>
      )}
      
      {isCompleted && (
        <div className="completion-message">
          Congratulations! Solved in {moves} moves!
        </div>
      )}
    </div>
  );
};

export default Controls;
