# AWS スライドパズル

AWS テーマのスライドパズルゲームです。React + TypeScript + Vite で実装されています。

## 機能

- 複数のパズルサイズ（3x3, 4x4, 5x5）から選択可能
- 手数カウンター
- 効果音（移動時、完成時）
- 紙吹雪エフェクト（完成時）
- モバイル対応（タッチ操作）

## 開発環境のセットアップ

```bash
# リポジトリをクローン
git clone https://github.com/yourusername/aws-slide-puzzle.git
cd aws-slide-puzzle

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

## ビルドとデプロイ

```bash
# プロダクションビルド
npm run build

# ローカルでプレビュー
npm run preview
```

GitHub Actions を使用して、`main` ブランチにプッシュすると自動的に GitHub Pages にデプロイされます。

## 必要なアセット

- `src/assets/images/amazon-q.png` - Amazon Q の画像
- `src/assets/sounds/move.mp3` - ピース移動時の効果音
- `src/assets/sounds/complete.mp3` - パズル完成時の拍手音

## ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。
