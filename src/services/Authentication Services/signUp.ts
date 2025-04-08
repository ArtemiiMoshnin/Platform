const baseUrl = import.meta.env.VITE_BASE_URL

export const signUp = async (userData: { username: string; email: string; password: string }) => {
  const response = await fetch(`${baseUrl}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user: userData }),
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.errors ? JSON.stringify(errorData.errors) : 'Ошибка регистрации')
  }

  const data = await response.json()
  return data
}
