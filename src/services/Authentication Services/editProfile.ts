const baseUrl = import.meta.env.VITE_BASE_URL

export const editProfile = async (userData: {
  username: string
  email: string
  password: string
  image: string | null
}) => {
  const token = localStorage.getItem('token')
  if (!token) {
    throw new Error('Token не найден в localStorage')
  }
  const response = await fetch(`${baseUrl}/user`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({ user: userData }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.errors ? JSON.stringify(errorData.errors) : 'Ошибка обновления данных')
  }

  const data = await response.json()
  return data
}
