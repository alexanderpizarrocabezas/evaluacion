import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { crearPost, obtenerPosts, reaccionarAPost } from '../services/usuario'

const inputClass =
  'w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-900 transition-colors outline-none placeholder:text-neutral-400 focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-500/20'

const REACCIONES = [
  { type: 'like', emoji: '👍', label: 'Me gusta' },
  { type: 'love', emoji: '❤️', label: 'Me encanta' },
  { type: 'haha', emoji: '😂', label: 'Jaja' },
  { type: 'wow', emoji: '😮', label: 'Wow' },
  { type: 'sad', emoji: '😢', label: 'Triste' },
  { type: 'angry', emoji: '😡', label: 'Enojado' },
]

function obtenerUsuarioLocal() {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null')
  } catch {
    return null
  }
}

function formatearFecha(fecha) {
  if (!fecha) return 'Fecha desconocida'
  const valor = new Date(fecha)
  if (Number.isNaN(valor.getTime())) return 'Fecha desconocida'

  return new Intl.DateTimeFormat('es-CL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(valor)
}

function Post() {
  const [titulo, setTitulo] = useState('')
  const [contenido, setContenido] = useState('')
  const [feedback, setFeedback] = useState('')
  const [posts, setPosts] = useState([])
  const [cargandoPosts, setCargandoPosts] = useState(true)
  const [reaccionando, setReaccionando] = useState({})

  const token = localStorage.getItem('token')
  const usuario = useMemo(() => obtenerUsuarioLocal(), [])

  useEffect(() => {
    async function cargarPosts() {
      try {
        const publicaciones = await obtenerPosts()
        setPosts(publicaciones)
      } catch (error) {
        setFeedback(error.message)
      } finally {
        setCargandoPosts(false)
      }
    }

    cargarPosts()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFeedback('')

    if (!token) {
      setFeedback('Debes iniciar sesión para publicar una entrada.')
      return
    }

    try {
      const { post } = await crearPost({ title: titulo, content: contenido }, token)
      setPosts((prev) => [post, ...prev])
      setTitulo('')
      setContenido('')
    } catch (error) {
      setFeedback(error.message)
    }
  }

  const handleReaction = async (postId, type) => {
    const key = `${postId}-${type}`
    setReaccionando((prev) => ({ ...prev, [key]: true }))
    setFeedback('')

    try {
      const { counts } = await reaccionarAPost(postId, type, usuario?.id || null)
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                reactions: counts || post.reactions || {},
              }
            : post,
        ),
      )
    } catch (error) {
      setFeedback(error.message)
    } finally {
      setReaccionando((prev) => ({ ...prev, [key]: false }))
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Publicaciones</h1>
        <p className="mt-2 text-sm text-neutral-500">
          Comparte ideas, dudas y recursos con tu curso.
        </p>
      </header>

      {token && usuario ? (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-4">
            <p className="text-sm font-medium text-neutral-700">
              Publicando como <span className="font-semibold text-violet-700">{usuario.name}</span>
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label htmlFor="titulo" className="mb-1.5 block text-sm font-medium text-neutral-700">
                Título
              </label>
              <input
                id="titulo"
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ej: ¿Alguien entiende esta parte?"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label htmlFor="contenido" className="mb-1.5 block text-sm font-medium text-neutral-700">
                Contenido
              </label>
              <textarea
                id="contenido"
                rows={6}
                value={contenido}
                onChange={(e) => setContenido(e.target.value)}
                placeholder="Escribe aquí lo que quieres compartir..."
                className={`${inputClass} resize-none`}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-opacity hover:opacity-90"
            >
              Publicar
            </button>
          </div>
        </form>
      ) : (
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-neutral-900">Únete para publicar</h2>
          <p className="mt-2 text-sm text-neutral-500">
            Regístrate para crear posts y reaccionar con emojis.
          </p>
          <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/registrarme"
              className="rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
            >
              Registrarme
            </Link>
            <Link
              to="/"
              className="rounded-full border border-neutral-300 px-6 py-3 text-sm font-semibold text-neutral-700 transition-colors hover:border-neutral-400 hover:text-neutral-900"
            >
              Ir al inicio
            </Link>
          </div>
        </div>
      )}

      {feedback && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700">
          {feedback}
        </p>
      )}

      <section className="space-y-5">
        {cargandoPosts ? (
          <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center text-sm text-neutral-500">
            Cargando publicaciones...
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-12 text-center text-sm text-neutral-500">
            Todavía no hay publicaciones. Sé el primero en publicar.
          </div>
        ) : (
          posts.map((post) => (
            <article key={post.id} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-violet-700">
                    {post.author?.name || 'Usuario anónimo'}
                  </p>
                  <p className="mt-1 text-xs text-neutral-500">{formatearFecha(post.createdAt)}</p>
                </div>
              </div>

              <h2 className="mt-4 text-xl font-bold text-neutral-900">{post.title}</h2>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-neutral-700">
                {post.content}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {REACCIONES.map(({ type, emoji, label }) => {
                  const count = post.reactions?.[type] ?? 0
                  const key = `${post.id}-${type}`

                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleReaction(post.id, type)}
                      disabled={reaccionando[key]}
                      className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <span aria-hidden="true">{emoji}</span>
                      <span>{label}</span>
                      {count > 0 && (
                        <span className="rounded-full bg-white px-1.5 py-0.5 text-[10px] font-semibold text-neutral-700">
                          {count}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  )
}

export default Post
