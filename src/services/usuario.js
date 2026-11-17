const DEFAULT_API_URL = 'https://backend-react-fcsl.onrender.com/api-backend'
const API_URL = import.meta.env.VITE_API_URL || DEFAULT_API_URL

async function parseJsonResponse(respuesta) {
  const texto = await respuesta.text()

  if (!texto) {
    return null
  }

  try {
    return JSON.parse(texto)
  } catch {
    return null
  }
}

// GET /users → devuelve la lista de usuarios registrados
export async function obtenerUsuarios() {
  const respuesta = await fetch(`${API_URL}/users`)
  const datos = await parseJsonResponse(respuesta)

  if (!respuesta.ok) {
    throw new Error(datos?.error || 'No se pudieron obtener los usuarios')
  }

  return Array.isArray(datos?.users) ? datos.users : []
}

// POST /auth/register → crea un usuario y devuelve { user, token }
export async function registrarUsuario(usuario) {
  const respuesta = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }, // avisamos que enviamos JSON
    body: JSON.stringify(usuario), // el body debe viajar como texto
  })
  const datos = await parseJsonResponse(respuesta)

  if (!respuesta.ok) {
    throw new Error(datos?.error || 'No se pudo registrar el usuario')
  }

  return datos || {}
}

// POST /auth/login → inicia sesión y devuelve { user, token }
export async function loginUsuario(credenciales) {
  const respuesta = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credenciales),
  })

  const datos = await parseJsonResponse(respuesta)

  if (!respuesta.ok) {
    throw new Error(datos?.error || 'No se pudo iniciar sesión')
  }

  return datos || {}
}

// GET /posts → lista publicaciones
export async function obtenerPosts() {
  const respuesta = await fetch(`${API_URL}/posts`)
  const datos = await parseJsonResponse(respuesta)

  if (!respuesta.ok) {
    throw new Error(datos?.error || 'No se pudieron obtener los posts')
  }

  return Array.isArray(datos?.posts) ? datos.posts : []
}

// POST /posts → crea una publicación
export async function crearPost(post, token) {
  const respuesta = await fetch(`${API_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(post),
  })

  const datos = await parseJsonResponse(respuesta)

  if (!respuesta.ok) {
    throw new Error(datos?.error || 'No se pudo crear el post')
  }

  return datos || {}
}

// POST /posts/:postId/reactions → agrega una reacción a un post
export async function reaccionarAPost(postId, type, userId = null) {
  const body = userId ? { type, userId } : { type }

  const respuesta = await fetch(`${API_URL}/posts/${postId}/reactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const datos = await parseJsonResponse(respuesta)

  if (!respuesta.ok) {
    throw new Error(datos?.error || 'No se pudo registrar la reacción')
  }

  return datos || {}
}

// DELETE /reactions/:id → elimina una reacción
export async function quitarReaccion(reactionId) {
  const respuesta = await fetch(`${API_URL}/reactions/${reactionId}`, {
    method: 'DELETE',
  })

  if (!respuesta.ok && respuesta.status !== 204) {
    const datos = await parseJsonResponse(respuesta)
    throw new Error(datos?.error || 'No se pudo quitar la reacción')
  }

  return true
}
