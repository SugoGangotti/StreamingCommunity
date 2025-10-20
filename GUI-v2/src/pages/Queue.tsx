import { useEffect, useState } from 'react'

type QueueItem = {
  _k: string
  id: string
  display_title: string
  display_type: string
  source: string
  source_alias: string
  display_release?: string
  bg_image_url?: string
  job_id?: string
  status?: 'pending' | 'in_progress' | 'completed'
}

function loadQueue(): QueueItem[] {
  try { return JSON.parse(localStorage.getItem('watchlist') || '[]') } catch { return [] }
}
function saveQueue(items: QueueItem[]) {
  localStorage.setItem('watchlist', JSON.stringify(items))
}

export default function Queue() {
  const [items, setItems] = useState<QueueItem[]>([])

  useEffect(() => {
    setItems(loadQueue())
  }, [])

  const startDownload = (jobId?: string) => {
    setItems(prev => {
      const updated: QueueItem[] = prev.map(it => it.job_id === jobId ? { ...it, status: 'in_progress' as const } : it)
      saveQueue(updated)
      // auto-complete after a short delay (mock)
      setTimeout(() => {
        const done: QueueItem[] = updated.map(it => it.job_id === jobId ? { ...it, status: 'completed' as const } : it)
        saveQueue(done)
        setItems(done)
      }, 1200)
      return updated
    })
  }

  const removeItem = (key?: string) => {
    setItems(prev => {
      const updated = prev.filter(it => it._k !== key)
      saveQueue(updated)
      return updated
    })
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Coda download</h1>
      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map(item => (
            <div key={item._k} className="bg-gray-800 border border-gray-700 rounded-xl p-6 relative overflow-hidden">
              {item.bg_image_url && (
                <>
                  <div className="absolute inset-0 opacity-20 bg-center bg-cover" style={{ backgroundImage: `url('${item.bg_image_url}')` }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent" />
                </>
              )}
              <div className="relative flex flex-col h-full">
                <div className="mb-4">
                  <h3 className="font-semibold text-white text-lg mb-2 line-clamp-2">{item.display_title}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-900/50 text-blue-300 border border-blue-700">{item.display_type}</span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-300 border border-gray-600">{item.source}</span>
                    {item.status && (
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${item.status === 'in_progress' ? 'bg-yellow-900/50 text-yellow-300 border-yellow-700' : item.status === 'pending' ? 'bg-indigo-900/50 text-indigo-300 border-indigo-700' : item.status === 'completed' ? 'bg-green-900/50 text-green-300 border-green-700' : 'bg-gray-800 text-gray-300 border-gray-600'}`}>
                        {item.status.replace('_',' ')}
                      </span>
                    )}
                  </div>
                  {item.display_release && <div className="mt-2 text-xs text-gray-300">{item.display_release}</div>}
                </div>
                <div className="mt-auto flex items-stretch gap-2">
                  <button onClick={()=>startDownload(item.job_id)} className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg">Avvia download</button>
                  <button onClick={()=>removeItem(item._k)} aria-label="Rimuovi" className="w-12 h-12 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"/></svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">La coda è vuota</h3>
          <p className="text-gray-400 mb-6">Aggiungi elementi dalla pagina dei risultati</p>
        </div>
      )}
    </div>
  )
}
