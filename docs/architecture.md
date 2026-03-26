# OWダーツの旅 アーキテクチャ方針

## 目的

本プロジェクトでは実装段階での迷いを減らすため、アーキテクチャパターンを次の通り固定する。

* バックエンド: クリーンアーキテクチャ（ただし現時点ではバックエンド未実装）
* フロントエンド: アトミックデザイン（UI部品の粒度と責務）

---

## 1. フロントエンド（Atomic Design）

### 1.1 レイヤ定義

* `Atoms`: 最小のUI部品（ラベル、ボタン、単一の表示要素など）
* `Molecules`: 複数 `Atoms` の組み合わせ（例: `RuleFilterSelector` の塊）
* `Organisms`: `Molecules` を含むより大きな機能単位（例: `SlotMachine`, `MapListPanel`）
* `Templates`: レイアウト（ページ構造）を組む器（例: メイン画面レイアウト）
* `Pages`: 画面の最終的なページ（例: `MainPage`）

### 1.2 責務分離ルール（重要）

* UIコンポーネントは「表示」と「ユーザー操作の受け口」に徹する
* 抽選ロジック、候補生成、localStorage の読み書きなどの「業務ロジック」は UI から直接持ち込まない
* 画面固有の状態調停は `src/presentation/hooks/` に集約する
* 業務ロジックは `src/application/useCases/` と `src/domain/` へ寄せる

### 1.3 ディレクトリ規約（推奨）

現行実装では `src/presentation/` 配下に atomic design を適用する。

* `src/presentation/components/atoms/`
* `src/presentation/components/molecules/`
* `src/presentation/components/organisms/`
* `src/presentation/templates/`
* `src/presentation/pages/`
* `src/presentation/hooks/`

---

## 2. バックエンド（Clean Architecture）

現時点ではバックエンド未実装だが、将来 API が必要になった場合を想定して責務分離を固定する。

### 2.1 レイヤ定義

* `Domain（ドメイン）`: エンティティ、値オブジェクト、ドメインルール（抽選ルール等の根）
* `Application（アプリケーション）`: ユースケース（抽選実行、リセット等のオーケストレーション）
* `Interface Adapters（インターフェースアダプタ）`: Controller/Presenter/Mapper 等の入出力変換
* `Infrastructure（インフラ）`: DB/外部ストレージ等の実装

### 2.2 バックエンドの前提

要件定義上、現状は「バックエンドなし」「localStorage に完結」となっているため、プロジェクト成果物としてはバックエンド実装は不要である。

---

## 3. 現時点の `src/` への対応方針（適用ルール）

* `src/domain/` に抽選条件やクールタイム判定などのドメインルールを置く
* `src/application/useCases/` に画面から呼ぶユースケースを置く
* `src/infrastructure/repositories/` に localStorage など外部I/O実装を置く
* `src/presentation/` に React コンポーネント、ページ、画面用 hooks を置く

---

## 4. 実装時のチェックリスト（AI生成・手実装共通）

* UI層から `localStorage` / 抽選ロジックへ直接アクセスしていないか
* UIの責務が表示とイベント受け口に保たれているか
* フロントエンド部品が atomic design の粒度に沿って切り出されているか（Atoms→Molecules→Organisms…）
* 将来バックエンドを追加する場合でも、Domain/Application/Infrastructure の境界が保てる形か
