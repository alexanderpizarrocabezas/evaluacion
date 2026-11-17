import { useState } from 'react'
import { Link } from 'react-router-dom'

function RecuperarPassword() {
  const [email, setEmail] = useState('')
  const [enviado, setEnviado] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setEnviado(true)
  }

  return (
    <div className="mx-auto max-w-md">
      <header className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          Recuperar contraseña
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Ingresa tu correo para recibir instrucciones de recuperación.
        </p>
      </header>

      {!enviado ? (
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.cl"
              className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-900 transition-colors outline-none placeholder:text-neutral-400 focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-500/20"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-opacity hover:opacity-90"
          >
            Enviar instrucciones
          </button>

          <p className="text-center text-sm text-neutral-500">
            <Link to="/iniciar-sesion" className="font-semibold text-violet-700 hover:text-violet-800">
              Volver al inicio de sesión
            </Link>
          </p>
        </form>
      ) : (
        <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
          <h2 className="mt-4 text-xl font-bold text-neutral-900">Solicitud enviada</h2>
          <p className="mt-2 text-sm text-neutral-600">
            Si el correo <span className="font-semibold">{email}</span> está registrado, recibirás instrucciones para restablecer tu contraseña.
          </p>
          <Link
            to="/iniciar-sesion"
            className="mt-6 inline-block rounded-full bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-700"
          >
            Volver a iniciar sesión
          </Link>
        </div>
      )}
    </div>
  )
}

export default RecuperarPassword
