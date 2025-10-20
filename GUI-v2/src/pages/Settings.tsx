import { useEffect, useState } from 'react'

type Prefs = {
  language: string
  downloadPath: string
  defaultPage?: string
}

function loadPrefs(): Prefs {
  try { return JSON.parse(localStorage.getItem('prefs') || '{}') } catch { return {} as any }
}
function savePrefs(p: Prefs) {
  localStorage.setItem('prefs', JSON.stringify(p))
}

export default function Settings() {
  const [language, setLanguage] = useState('it')
  const [downloadPath, setDownloadPath] = useState('C:/Downloads')
  const [defaultPage, setDefaultPage] = useState<string>('/')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const p = loadPrefs()
    if (p.language) setLanguage(p.language)
    if (p.downloadPath) setDownloadPath(p.downloadPath)
    if (p.defaultPage) setDefaultPage(p.defaultPage)
  }, [])

  const onSave = (e: React.FormEvent) => {
    e.preventDefault()
    savePrefs({ language, downloadPath, defaultPage })
    setSaved(true)
    setTimeout(() => setSaved(false), 1200)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-4">Impostazioni</h1>
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
        <form onSubmit={onSave} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2">Pagina predefinita (dopo il login)</label>
            <select value={defaultPage} onChange={e=>setDefaultPage(e.target.value)} className="bg-white text-gray-900 border border-gray-300 rounded-lg py-2 px-3">
              <option value="/">Home / Search</option>
              <option value="/home">Home (nuova)</option>
              <option value="/queue">Queue</option>
              <option value="/settings">Settings</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2">Lingua</label>
            <select value={language} onChange={e=>setLanguage(e.target.value)} className="bg-white text-gray-900 border border-gray-300 rounded-lg py-2 px-3">
              <option value="it">Italiano</option>
              <option value="en">English</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-200 mb-2">Download Path</label>
            <input value={downloadPath} onChange={e=>setDownloadPath(e.target.value)} className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg py-2 px-3" />
          </div>
          <div className="flex items-center gap-3">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg">Salva</button>
            {saved && <span className="text-green-300 text-sm">Salvato!</span>}
          </div>
        </form>
      </div>
    </div>
  )
}
