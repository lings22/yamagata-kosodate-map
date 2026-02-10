## Agent Teams - Code Audit Configuration

### Team Definition

このプロジェクトでは、Agent Teamsを使ってコードベースの包括的な精査を行います。

### Teammates

- team-lead: プロジェクト進行管理。タスクの分配、進捗確認、最終レポートの統合を担当。他のエージェントの作業結果を集約し、人間（Masa）に報告する。
- code-scanner: 静的コード解析担当。TypeScript型エラー、未使用のimport/変数/コンポーネント、ビルドエラー、lint警告、デッドコードを検出する。`npx tsc --noEmit` や `npx next lint` を実行して問題を洗い出す。
- api-auditor: API・セキュリティ監査担当。Google Maps API、Supabase接続、APIルートのエラーハンドリング、APIキーの露出リスク、Supabase RLS（Row Level Security）設定、CORS設定、認証フローを検証する。
- performance-reviewer: パフォーマンス・コード品質担当。不要なre-render、巨大コンポーネントの分割可能性、バンドルサイズ、画像最適化、重複コード、未使用の依存パッケージ（package.json）を検出する。`npx next build` の出力やバンドル分析も行う。
- ux-tester: UX・エッジケース検証担当。フィルタの組み合わせパターン、口コミ投稿のバリデーション（XSS対策含む）、空状態・エラー状態・ローディング状態のハンドリング、モバイルレスポンシブ、アクセシビリティを検証する。
- red-team: 批判的レビュー担当。他の全エージェントの分析結果を独立した視点でレビューし、見落とし・楽観的な判断・前提の誤りを指摘する。必要に応じてWeb検索で業界のベストプラクティスと照合する。最終的にGO / CONDITIONAL-GO / NO-GOの判定を出す。
- fixer: 修正担当。他のエージェントが発見した問題に対して、具体的な修正コードを作成する。修正は最小限の変更にとどめ、既存機能を壊さないことを最優先とする。

### Task Workflow

1. code-scanner と api-auditor と performance-reviewer が並列で調査開始
2. ux-tester が上記3つの結果も参考にしながらUX観点で検証
3. 全調査完了後、red-team が全結果を独立レビュー
4. red-team の指摘に基づき、fixer が修正コード作成
5. team-lead が全結果を統合して最終レポート作成

### Severity Levels

- CRITICAL: 本番で即座に問題を起こす可能性がある（データ消失、セキュリティ脆弱性、APIキー露出など）
- HIGH: ユーザー体験に重大な影響がある（主要機能の動作不良、パフォーマンス劣化など）
- MEDIUM: 品質改善が推奨される（コード重複、型安全性の欠如、エラーハンドリング不足など）
- LOW: あれば良い改善（命名規則、コメント追加、リファクタリング提案など）

### Output Format

最終レポートは以下の構成で出力する：
1. エグゼクティブサマリー（全体評価・GO判定）
2. CRITICAL/HIGH問題の一覧と修正提案
3. MEDIUM/LOW問題の一覧
4. コード肥大化レポート（削除可能なコード量の見積もり）
5. 推奨アクションリスト（優先順位付き）