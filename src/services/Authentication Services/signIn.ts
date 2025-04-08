const baseUrl = import.meta.env.VITE_BASE_URL

export const signIn = async (userData: { email: string; password: string }) => {
  const response = await fetch(`${baseUrl}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user: userData }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.errors ? JSON.stringify(errorData.errors) : 'Ошибка авторизации')
  }

  const data = await response.json()
  localStorage.setItem('token', data.user.token)
  return data
}
