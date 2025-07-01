# 🎬 Netflix Player

Netflix 風の動画プレイヤーを TypeScript + Vite で実装したプロジェクトです。関数型プログラミングスタイルを採用し、モダンな Web テクノロジーを使用して、直感的で美しいユーザーインターフェースを提供します。

## ✨ 機能

### 🎮 基本操作

-   **再生/一時停止**: ワンクリックまたは画面クリックで動画の再生状態を切り替え
-   **10 秒早送り/巻き戻し**: 正確な時間操作でスムーズな視聴体験
-   **プログレスバー**: 視覚的な再生進捗表示とクリックでのシーク機能
-   **時間表示**: 現在時間/総時間をリアルタイム表示（例: `1:34 / 5:23`）
-   **音量調整**: Netflix 風赤色プログレス付きスライダーでの細かい音量調整
-   **ミュート機能**: アイコンクリックで瞬時にミュート/解除
-   **フルスクリーン**: 没入感のあるフルスクリーン視聴

### ⌨️ キーボードショートカット

| キー    | 機能                   |
| ------- | ---------------------- |
| `Space` | 再生/一時停止          |
| `→`     | 10 秒早送り            |
| `←`     | 10 秒巻き戻し          |
| `F`     | フルスクリーン切り替え |

### 🖱️ マウス操作

| 操作                   | 機能              |
| ---------------------- | ----------------- |
| **動画画面クリック**   | **再生/一時停止** |
| プログレスバークリック | シーク            |
| 音量スライダー         | 音量調整          |
| コントロールボタン     | 各種機能          |

### 🎨 UI/UX 機能

-   **ダークテーマ**: Netflix 風の洗練されたダークデザイン（#141414 背景）
-   **レスポンシブ対応**: デスクトップ・モバイル両対応
-   **自動非表示**: 再生中は 3 秒後にコントロールが自動で隠れる
-   **ホバーエフェクト**: ボタンにマウスを合わせると拡大アニメーション
-   **動的アイコン**: 状態に応じてアイコンが自動で変化
-   **Netflix 風カラー**: プログレスバーと音量バーに特徴的な赤色（#e50914）

### 🔧 技術的特徴

-   **関数型プログラミング**: 純粋関数とカリー化を活用した保守性の高い実装
-   **完全 TypeScript**: 厳密な型安全性を重視した実装
-   **モジュラー設計**: 機能ごとに分離された関数で構成
-   **イベント駆動**: 効率的なイベントハンドリング
-   **エラーハンドリング**: 適切な例外処理とログ出力

## 🚀 セットアップ

### 前提条件

-   Node.js (v16 以上)
-   pnpm (推奨) または npm

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/9891yamar/netflix-player.git
cd netflix-player

# 依存関係をインストール
pnpm install
# または
npm install
```

### 開発サーバーの起動

```bash
# 開発サーバーを起動
pnpm dev
# または
npm run dev

# ブラウザで http://localhost:5173 を開く
```

### サンプル動画の配置

1. `public` フォルダに動画ファイルを配置
2. ファイル名を `sample.mp4` にする
3. または、フォールバック動画として無料のサンプル動画が自動で使用されます

## 📁 プロジェクト構造

```
netflix-player/
├── public/
│   ├── vite.svg
│   └── sample.mp4          # サンプル動画（オプション）
├── src/
│   ├── main.ts            # 関数型メインTypeScriptファイル
│   ├── style.css          # Netflix風スタイルシート
│   ├── counter.ts         # （未使用）
│   ├── typescript.svg     # （未使用）
│   └── vite-env.d.ts      # 型定義
├── index.html             # メインHTMLファイル
├── package.json
├── tsconfig.json          # TypeScript設定（strict mode）
├── pnpm-lock.yaml
├── .gitignore
├── .gitattributes
└── README.md
```

## 🛠️ 技術スタック

-   **フロントエンド**: TypeScript (関数型), HTML5, CSS3
-   **ビルドツール**: Vite
-   **アイコン**: Font Awesome 6
-   **型チェック**: TypeScript (strict mode)
-   **パッケージマネージャー**: pnpm
-   **バージョン管理**: Git

## 📱 対応ブラウザ

-   Chrome (推奨)
-   Firefox
-   Safari
-   Edge

## 🎯 主要な関数とインターフェース

### 型定義

```typescript
interface PlayerElements {
    video: HTMLVideoElement;
    playPauseBtn: HTMLButtonElement;
    // ... その他のDOM要素
}

interface PlayerState {
    hideControlsTimeout: number | null;
    isUserSeeking: boolean;
}
```

### 主要関数

-   `togglePlayPause(elements: PlayerElements)`: 再生/一時停止の切り替え
-   `seek(elements: PlayerElements)(seconds: number)`: 指定秒数の早送り/巻き戻し
-   `updateProgress(elements, state)`: プログレスバーと時間表示の更新
-   `updateVolumeProgress(elements)`: 音量バーの赤色プログレス更新
-   `handleVideoClick(elements)`: 画面クリック処理
-   `formatTime(seconds: number)`: 時間フォーマット（M:SS 形式）

## 🔧 カスタマイズ

### スタイルの変更

`src/style.css` で Netflix 風のスタイルをカスタマイズできます：

```css
/* メインカラーの変更 */
#progress-fill,
#volume-progress {
    background-color: #your-color; /* デフォルト: #e50914 */
}

/* 背景色の変更 */
body {
    background-color: #your-bg-color; /* デフォルト: #141414 */
}

/* 時間表示のカスタマイズ */
#time-display {
    font-size: 14px; /* デフォルト: 13px */
    color: #your-text-color;
}
```

### 機能の拡張

関数型アーキテクチャにより、新しい機能を簡単に追加できます：

```typescript
// 新しい機能の追加例
const customFeature = (elements: PlayerElements) => (param: any) => {
    // 機能の実装
};

// イベントリスナーに追加
elements.someButton.addEventListener("click", customFeature(elements));
```

## 🐛 トラブルシューティング

### 動画が表示されない

1. `public/sample.mp4` ファイルが存在するか確認
2. 動画ファイルが MP4 形式か確認
3. ブラウザのネットワークタブでフォールバック動画の読み込みを確認

### コントロールが動作しない

1. ブラウザのコンソールでエラーをチェック
2. TypeScript コンパイルエラーがないか確認
3. DOM 要素の ID が正しく設定されているか確認

### 時間表示が正しくない

1. 動画ファイルのメタデータが正しく読み込まれているか確認
2. `loadedmetadata` イベントが発火しているか確認

### 画面クリックが効かない

1. 他の要素がクリックイベントを阻害していないか確認
2. コントロール領域外をクリックしているか確認

## 🎬 デモ

### 機能別デモ

1. **基本再生**: スペースキーまたは画面クリックで再生/一時停止
2. **シーク操作**: プログレスバーをクリックして任意の位置にジャンプ
3. **音量調整**: 音量スライダーで調整、赤色プログレスで視覚的フィードバック
4. **フルスクリーン**: F キーまたはボタンで切り替え
5. **時間表示**: リアルタイムで現在時間と総時間を表示

## 📄 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'feat: Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

### コミットメッセージのフォーマット

```
feat: 新機能の追加
fix: バグ修正
style: スタイルの変更
refactor: リファクタリング
docs: ドキュメントの更新
```

## 📞 サポート

問題や質問がある場合は、[Issue](https://github.com/9891yamar/netflix-player/issues)を作成してください。

## 🏆 開発ハイライト

-   ✅ Netflix 風 UI/UX の完全再現
-   ✅ 関数型プログラミングによる保守性向上
-   ✅ TypeScript による型安全性
-   ✅ レスポンシブデザイン
-   ✅ アクセシビリティ対応
-   ✅ クロスブラウザ対応

---

**Built with ❤️ using Functional TypeScript and Vite**

🎬 **Netflix-quality video player experience in your browser!**
