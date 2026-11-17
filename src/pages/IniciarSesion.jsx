import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUsuario } from '../services/usuario'

const inputClass =
  'w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-900 transition-colors outline-none placeholder:text-neutral-400 focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-500/20'

function IniciarSesion() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [feedback, setFeedback] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFeedback('')
    setCargando(true)

    try {
      const { user, token } = await loginUsuario({ email, password })
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      navigate('/post')
    } catch (error) {
      setFeedback(error.message)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <header className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          Iniciar sesión
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Accede con tu correo y contraseña para entrar a la comunidad.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5 rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm"
      >
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-neutral-700">
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@correo.cl"
            className={inputClass}
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-neutral-700">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className={inputClass}
            required
          />
        </div>

        <button
          type="submit"
          disabled={cargando}
          className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {cargando ? 'Ingresando...' : 'Entrar a mi cuenta'}
        </button>

        {feedback && (
          <p
            aria-live="polite"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700"
          >
            {feedback}
          </p>
        )}

        <div className="space-y-2 text-center text-sm text-neutral-500">
          <p>
            ¿No tienes cuenta?{' '}
            <Link to="/registrarme" className="font-semibold text-violet-700 hover:text-violet-800">
              Regístrate
            </Link>
          </p>
          <p>
            <Link to="/recuperar-password" className="font-semibold text-violet-700 hover:text-violet-800">
              ¿Olvidaste tu contraseña?
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}

export default IniciarSesion
