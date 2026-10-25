# 写真の投稿と外部プラットフォームへの配信

## 📷 フォトギャラリー(`/photos`)

Notion のデータベースに写真専用の投稿を追加すると、サイトの `/photos` ページにギャラリーとして表示されます。

### 使い方

1. Notion のブログ用データベースで **`type` セレクトに `Photo` という選択肢を追加**する(初回のみ)
2. 新しい行を作成し、以下を設定する
   - `title`: 写真のタイトル(ギャラリーのホバー時に表示)
   - `slug`: URL 用の文字列(例: `tokyo-2026`)
   - `type`: `Photo`
   - `status`: `Published`
   - `date`: 撮影日・公開日
3. ページの中身に**写真をアップロード**する(複数枚 OK)

- ギャラリーには各投稿の **1 枚目の写真**がサムネイルとして並びます
- クリックすると投稿ページが開き、全ての写真とテキストが表示されます
- 写真は Notion の画像プロキシ経由で配信されるため、**URL の期限切れで画像が壊れる心配はありません**
- `type: Photo` の投稿はブログ一覧・検索・RSS には表示されません(ギャラリー専用)

ナビゲーションの「Photos」リンクは `blog.config.js` の `showPhotos` で表示/非表示を切り替えられます。

## 📨 Substack への配信(RSS)

RSS フィード(`https://www.daisukesone.me/feed`)が**記事の全文**を含むようになりました。

### 記事をまとめて取り込む

1. Substack の管理画面 → **Settings → Import**
2. 「Import from RSS」に `https://www.daisukesone.me/feed` を入力
3. 取り込む記事を選んで公開

RSS には最新 10 件の記事が全文(画像込み)で含まれます。新しい記事を書いたら、再度インポートすれば差分だけ取り込めます。

## 📝 note への投稿(Markdown コピペ)

note には投稿 API がないため、Markdown を書き出してコピペする方式です。

### 使い方

記事の slug を使って以下の URL を開きます:

```
https://www.daisukesone.me/api/markdown/<記事のslug>
```

例: `https://www.daisukesone.me/api/markdown/my-first-post`

- 表示された Markdown を全選択してコピーし、note のエディタに貼り付けます(note は Markdown 記法の貼り付けに対応)
- `?download=1` を付けると `.md` ファイルとしてダウンロードできます
- 画像は Notion プロキシの URL で埋め込まれているので、note 側で画像をアップロードし直す場合は各画像 URL を開いて保存してください

この Markdown は Substack のエディタへの貼り付けにも使えます(1 記事だけ転載したい場合は RSS インポートより手軽です)。
