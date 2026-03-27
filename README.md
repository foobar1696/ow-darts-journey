# OWダーツの旅

Overwatch のカスタムゲームで手早くマップを決めるための、フロントエンド完結型ブラウザアプリです。  
毎回「次のマップはどうするか」を考える手間を減らしつつ、人気・不人気にかかわらずランダムに決められるようにしています。  
スロット風の演出で抽選しつつ、直近に当選したマップは 24 時間のクールタイムに入ります。

## このプロジェクトについて

仲間内で気軽に使えるマップセレクターを目指して作った、シンプルな静的 Web ツールです。  
ローカル環境の準備なしでそのまま使えることを重視し、GitHub Pages で公開しています。

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

## GitHub Pages

`main` へ push すると、GitHub Actions でビルドして GitHub Pages へ公開できます。  
公開URLは `https://foobar1696.github.io/ow-darts-journey/` を想定しています。

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
* ユーザーマニュアル: `docs/user_manual.md`
* アーキテクチャ方針: `docs/architecture.md`
* ユニットテスト方針: `docs/unit_test_policy.md`

## 問い合わせ・更新情報

不具合報告や改善提案は [GitHub Issues](https://github.com/foobar1696/ow-darts-journey/issues) で受け付けています。  
開発まわりの更新情報や告知は [X: @foobar1696](https://x.com/foobar1696) でも案内しています。

## 運営方針

このプロジェクトは MIT ライセンスのもとで公開しており、利用・改変・再配布はライセンスの範囲で自由に行えます。  
Pull Request や提案は歓迎しています。  
一方で、本家リポジトリへのレビューとマージ判断は、内容の整合性と安全性を確認するためにメンテナーが行います。

## ライセンス

MIT

## 補足

このリポジトリでは、実装補助やレビュー補助に生成AIツールを利用することがあります。反映内容は人手で確認・修正しています。
