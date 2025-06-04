import type { FC } from 'react';
import '../styles/Controls.css';

interface ControlsProps {
  size: number;
  moves: number;
  onSizeChange: (size: number) => void;
  onReset: () => void;
  isCompleted: boolean;
}

const Controls: FC<ControlsProps> = ({
  size,
  moves,
  onSizeChange,
  onReset,
  isCompleted
}) => {
  const sizeOptions = [3, 4, 5];
  
  return (
    <div className="controls">
      <div className="control-group">
        <label htmlFor="puzzle-size">パズルサイズ:</label>
        <select
          id="puzzle-size"
          value={size}
          onChange={(e) => onSizeChange(Number(e.target.value))}
          disabled={isCompleted}
        >
          {sizeOptions.map((option) => (
            <option key={option} value={option}>
              {option} x {option}
            </option>
          ))}
        </select>
      </div>
      
      <div className="control-group">
        <span className="moves-counter">手数: {moves}</span>
      </div>
      
      <div className="control-group">
        <button className="reset-button" onClick={onReset}>
          リセット
        </button>
      </div>
      
      {isCompleted && (
        <div className="completion-message">
          おめでとうございます！{moves}手でクリアしました！
        </div>
      )}
    </div>
  );
};

export default Controls;
