const baseUrl = import.meta.env.VITE_BASE_URL

export const getCurrentUser = async () => {
  const token = localStorage.getItem('token')
  if (!token) {
    throw new Error('Token не найден в localStorage')
  }
  const response = await fetch(`${baseUrl}/user`, {
    method: 'GET',
    headers: {
      Authorization: `Token ${token}`,
    },
  })
  if (!response.ok) {
    localStorage.removeItem('token')
    return null
  }

  return response.json()
}
