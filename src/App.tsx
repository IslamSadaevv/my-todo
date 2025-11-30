import { useEffect, useMemo, useState, type JSX } from 'react'

const STORAGE_KEY = 'my_todo_list_v2'

type Priority = 'low' | 'medium' | 'high'

interface Todo {
  id: number
  text: string
  completed: boolean
  createdAt: number
  dueDate?: string | null // ISO date string yyyy-mm-dd
  priority: Priority
}

type Filter = 'all' | 'active' | 'completed'
type SortBy = 'newest' | 'oldest' | 'priority' | 'dueDate'

function formatDate(iso?: string | null) {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    return d.toLocaleDateString()
  } catch {
    return iso
  }
}

function PriorityBadge({ p }: { p: Priority }) {
  return <span className={`badge priority ${p}`}>{p}</span>
}

function IconEdit() {
  return <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden><path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"/></svg>
}
function IconTrash() {
  return <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden><path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
}
function IconCheck() {
  return <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
}

export default function App(): JSX.Element {
  const [todos, setTodos] = useState<Todo[]>([])
  const [text, setText] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [sortBy, setSortBy] = useState<SortBy>('newest')
  const [query, setQuery] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingText, setEditingText] = useState('')
  const [editingDue, setEditingDue] = useState<string>('')
  const [editingPriority, setEditingPriority] = useState<Priority>('low')

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setTodos(JSON.parse(raw) as Todo[])
    } catch (e) {
      console.error('Kan localStorage niet lezen', e)
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
    } catch (e) {
      console.error('Kan localStorage niet schrijven', e)
    }
  }, [todos])

  function resetNewInputs() {
    setText('')
  }

  function addTodo(e?: React.FormEvent<HTMLFormElement>) {
    e?.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    const newTodo: Todo = {
      id: Date.now(),
      text: trimmed,
      completed: false,
      createdAt: Date.now(),
      dueDate: null,
      priority: 'low',
    }
    setTodos(prev => [newTodo, ...prev])
    resetNewInputs()
  }

  function startEdit(todo: Todo) {
    setEditingId(todo.id)
    setEditingText(todo.text)
    setEditingDue(todo.dueDate ?? '')
    setEditingPriority(todo.priority)
  }

  function saveEdit() {
    if (editingId == null) return
    const trimmed = editingText.trim()
    if (!trimmed) return
    setTodos(prev => prev.map(t => t.id === editingId ? { ...t, text: trimmed, dueDate: editingDue || null, priority: editingPriority } : t))
    setEditingId(null)
    setEditingText('')
    setEditingDue('')
    setEditingPriority('low')
  }

  function cancelEdit() {
    setEditingId(null)
    setEditingText('')
    setEditingDue('')
    setEditingPriority('low')
  }

  function toggleTodo(id: number) {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  function deleteTodo(id: number) {
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  function clearCompleted() {
    const confirmed = confirm('Weet je zeker dat je alle voltooide taken wilt verwijderen?')
    if (!confirmed) return
    setTodos(prev => prev.filter(t => !t.completed))
  }

  const remaining = todos.filter(t => !t.completed).length

  // filtering/searching/sorting
  const visible = useMemo(() => {
    let arr = todos.slice()
    if (filter === 'active') arr = arr.filter(t => !t.completed)
    else if (filter === 'completed') arr = arr.filter(t => t.completed)

    if (query.trim()) {
      const q = query.toLowerCase()
      arr = arr.filter(t => t.text.toLowerCase().includes(q))
    }

    if (sortBy === 'newest') arr.sort((a, b) => b.createdAt - a.createdAt)
    if (sortBy === 'oldest') arr.sort((a, b) => a.createdAt - b.createdAt)
    if (sortBy === 'priority') {
      const score = (p: Priority) => (p === 'high' ? 2 : p === 'medium' ? 1 : 0)
      arr.sort((a, b) => score(b.priority) - score(a.priority) || b.createdAt - a.createdAt)
    }
    if (sortBy === 'dueDate') {
      arr.sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime()
      })
    }

    return arr
  }, [todos, filter, query, sortBy])

  return (
    <div className="app-shell">
      <div className="container card">
        <header className="top">
          <div>
            <h1>Todo • Islam Sadaev</h1>
            <p className="subtitle">Schrijf taken, plan deadlines en houd overzicht, alles lokaal opgeslagen.</p>
          </div>

          <div className="stats">
            <div className="stat">
              <strong>{remaining}</strong>
              <span>open</span>
            </div>
            <div className="stat">
              <strong>{todos.length}</strong>
              <span>totaal</span>
            </div>
          </div>
        </header>

        <section className="create">
          <form onSubmit={addTodo} className="create-form" aria-label="Nieuwe taak toevoegen">
            <input
              className="input-main"
              type="text"
              placeholder="Voeg een taak toe (bijv. 'Boodschappen doen')"
              value={text}
              onChange={(e) => setText(e.target.value)}
              aria-label="Nieuwe taak"
            />
            <div className="row-controls">
              <button type="submit" className="btn primary">Voeg toe</button>
            </div>
          </form>

          <div className="search-row">
            <input aria-label="Zoeken" className="input-search" placeholder="Zoeken..." value={query} onChange={(e) => setQuery(e.target.value)} />
            <select aria-label="Sorteren" value={sortBy} onChange={(e) => setSortBy(e.target.value as SortBy)}>
              <option value="newest">Nieuwste</option>
              <option value="oldest">Oudste</option>
              <option value="priority">Prioriteit</option>
              <option value="dueDate">Deadline</option>
            </select>
          </div>
        </section>

        <section className="controls-bar">
          <div className="filters" role="tablist" aria-label="Filters">
            <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>Alle</button>
            <button className={filter === 'active' ? 'active' : ''} onClick={() => setFilter('active')}>Actief</button>
            <button className={filter === 'completed' ? 'active' : ''} onClick={() => setFilter('completed')}>Voltooid</button>
          </div>
          <div>
            <button onClick={clearCompleted} className="btn ghost">Verwijder voltooide</button>
          </div>
        </section>

        <ul className="todo-list" aria-live="polite">
          {visible.length === 0 ? (
            <li className="empty">Geen taken</li>
          ) : visible.map(t => (
            <li key={t.id} className={`todo-item ${t.completed ? 'done' : ''}`}>
              <div className="left">
                <label className="checkbox">
                  <input type="checkbox" checked={t.completed} onChange={() => toggleTodo(t.id)} aria-label={`Markeer ${t.text}`} />
                  <span className="fakebox">{t.completed ? <IconCheck /> : null}</span>
                </label>

                <div className="meta">
                  {editingId === t.id ? (
                    <div className="edit-form">
                      <input value={editingText} onChange={(e) => setEditingText(e.target.value)} className="edit-input" />
                      <input type="date" value={editingDue} onChange={(e) => setEditingDue(e.target.value)} className="edit-date" />
                      <select value={editingPriority} onChange={(e) => setEditingPriority(e.target.value as Priority)} className="edit-prio">
                        <option value="low">low</option>
                        <option value="medium">medium</option>
                        <option value="high">high</option>
                      </select>
                      <div className="edit-actions">
                        <button className="btn primary small" onClick={saveEdit}>Opslaan</button>
                        <button className="btn ghost small" onClick={cancelEdit}>Annuleer</button>
                      </div>
                    </div>
                  ) : (
                    <div className="content" onDoubleClick={() => startEdit(t)}>
                      <div className="title-row">
                        <div className="text">{t.text}</div>
                        <div className="badges">
                          {t.priority !== 'low' && <PriorityBadge p={t.priority} />}
                          {t.dueDate && <span className={`badge due ${new Date(t.dueDate).getTime() < Date.now() && !t.completed ? 'overdue' : ''}`}>⏰ {formatDate(t.dueDate)}</span>}
                        </div>
                      </div>
                      <div className="sub">{new Date(t.createdAt).toLocaleString()}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="actions">
                <button className="icon" title="Bewerk" onClick={() => startEdit(t)} aria-label={`Bewerk ${t.text}`}><IconEdit /></button>
                <button className="icon danger" title="Verwijder" onClick={() => deleteTodo(t.id)} aria-label={`Verwijder ${t.text}`}><IconTrash /></button>
              </div>
            </li>
          ))}
        </ul>

        <footer className="foot">
          <div>Gemaakt met ❤️ | lokaal opgeslagen in je browser.</div>
          <div className="small-muted">Tip: dubbelklik op een taak om snel te bewerken.</div>
        </footer>
      </div>
    </div>
  )
}
