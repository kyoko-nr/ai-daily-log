/** 過去ログ一覧ページのローディング表示。 */
export default function LogsLoading() {
  return (
    <div className="min-h-screen bg-white px-6 py-16">
      <main className="mx-auto w-full max-w-3xl">
        <div className="animate-pulse space-y-6">
          <div className="space-y-3">
            <div className="h-4 w-24 rounded bg-zinc-200" />
            <div className="h-8 w-32 rounded bg-zinc-200" />
            <div className="h-4 w-48 rounded bg-zinc-200" />
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-24 rounded-2xl border border-zinc-200 bg-zinc-50"
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
