import { useState, useEffect } from 'react';

interface SplitImage {
  pieces: string[];
  loaded: boolean;
}

export const useImageSplitter = (
  imageSrc: string,
  size: number
): SplitImage => {
  const [pieces, setPieces] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const pieceWidth = img.width / size;
      const pieceHeight = img.height / size;
      const newPieces: string[] = [];

      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const canvas = document.createElement('canvas');
          canvas.width = pieceWidth;
          canvas.height = pieceHeight;
          const ctx = canvas.getContext('2d');
          
          if (ctx) {
            ctx.drawImage(
              img,
              x * pieceWidth, y * pieceHeight,
              pieceWidth, pieceHeight,
              0, 0,
              pieceWidth, pieceHeight
            );
            newPieces.push(canvas.toDataURL());
          }
        }
      }

      setPieces(newPieces);
      setLoaded(true);
    };
  }, [imageSrc, size]);

  return { pieces, loaded };
};
