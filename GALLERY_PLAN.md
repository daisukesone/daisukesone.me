# ギャラリービュー実装計画（改訂版）

## 概要
**ブログ用Notionデータベースとは別に、写真専用のNotionデータベースを作成**し、
それを参照するギャラリーページを実装する。

## アーキテクチャ

```
[既存] NOTION_PAGE_ID → ブログ投稿DB
[新規] NOTION_GALLERY_PAGE_ID → 写真ギャラリーDB（別DB）

写真ギャラリーDB
  → getAllPhotos.js（全写真を取得）
  → /gallery ページ
  → Gallery コンポーネント（マソンリーグリッド）
  → PhotoCard（個別写真カード）→ Lightbox（フルサイズ表示）
```

## Notionセットアップ（ユーザー側）

### ギャラリーデータベースのスキーマ
| プロパティ名 | タイプ | 用途 |
|------------|--------|------|
| Title      | Title  | 写真のキャプション |
| Date       | Date   | 撮影日（任意） |
| Tags       | Multi-select | カテゴリ分け（任意） |

- 各ページに **カバー画像** を設定（Notionのページカバー機能を使用）
- データベースを公開するか `NOTION_ACCESS_TOKEN` を使用

### 環境変数
```
NOTION_GALLERY_PAGE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 修正・作成するファイル

### 1. `blog.config.js`
```js
showGallery: true,
galleryPageId: process.env.NOTION_GALLERY_PAGE_ID,
```

### 2. `lib/lang.js`
各言語に NAV.GALLERY を追加:
- en: 'Gallery'
- ja: 'ギャラリー'
- zh-CN/HK/TW: '相册'
- es: 'Galería'

### 3. `lib/notion/getAllPhotos.js` （新規）
- `BLOG.galleryPageId` を使って別DBから全エントリを取得
- 各エントリからカバー画像URL (`block[id].value?.format?.page_cover`) を抽出
- title、date、tags、cover を返す

### 4. `lib/notion.js`
- `getAllPhotos` をエクスポートに追加

### 5. `components/Header.js`
- `BLOG.showGallery` が true の場合、Gallery リンクを NavBar に追加

### 6. `pages/gallery.js` （新規）
- `getStaticProps` で `getAllPhotos()` を呼んで写真一覧を取得
- ISR: `revalidate: 1`
- Gallery コンポーネントに渡して表示

### 7. `components/Gallery.js` （新規）
- CSS Columns によるマソンリーレイアウト
- レスポンシブ: モバイル1列 / タブレット2列 / デスクトップ3列
- 写真がない場合の空状態表示

### 8. `components/PhotoCard.js` （新規）
- Next.js `Image` でカバー画像表示
- hover でキャプション（タイトル）オーバーレイ
- クリックでLightboxを開く

### 9. `components/Lightbox.js` （新規）
- フルサイズ画像のオーバーレイ
- ×ボタン・背景クリックで閉じる
- 前後ナビゲーション（矢印ボタン）
- キーボード: Esc=閉じる、←→=前後移動

### 10. `next.config.js`
Notion画像ドメインを追加:
- `www.notion.so`
- `s3.us-west-2.amazonaws.com`
- `s3-us-west-2.amazonaws.com`
- `images.unsplash.com`（Notionのデフォルトカバーで使用）

## メリット（別DBアプローチ）
- ブログ投稿と写真を完全に分離
- ギャラリー専用のスキーマを自由に設計可能
- ブログDBのパフォーマンスに影響しない
- 将来的にギャラリー専用の機能（位置情報、カメラ情報など）を追加しやすい
