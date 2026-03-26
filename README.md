# OWダーツの旅

Overwatch のマップをランダムに決めるための、フロントエンド完結型ブラウザアプリです。  
スロット風の演出で抽選しつつ、直近に当選したマップは 24 時間のクールタイムに入ります。

## できること

* `src/data/maps.yaml` から読み込んだマッププールを使って抽選する
* マップルールごとに抽選対象を絞り込む
* スロット風演出で抽選結果を表示する
* 当選したマップを 24 時間クールタイム対象として扱う
* クールタイム中のマップ一覧を確認し、必要なら `CTリセット` で解除する

## データの扱い

* マッププールの定義元は `src/data/maps.yaml`
* クールタイム状態とルール選択状態はブラウザの `localStorage` に保存
* 同じ端末・同じブラウザでは、再読み込み後も状態を復元
* 別ブラウザ・別端末とは共有しない

## 開発

```bash
npm install
npm run dev
```

## 品質確認

```bash
npm run lint
npm run typecheck
npm test
```

## ビルド

```bash
npm run build
```

## テストカバレッジ確認

```bash
npm run test:coverage
```

実行後、ターミナルには statement / branch / function / line のカバレッジ要約が表示されます。  
詳細レポートは `coverage/index.html` に出力されます。

## ドキュメント

* 要件定義: `docs/requirements.md`
* 基本設計: `docs/basic_design.md`
* 詳細設計: `docs/detail_design.md`
* アーキテクチャ方針: `docs/architecture.md`
* ユニットテスト方針: `docs/unit_test_policy.md`

## ライセンス

MIT

## 補足

このリポジトリでは、実装補助やレビュー補助に生成AIツールを利用することがあります。反映内容は人手で確認・修正しています。
