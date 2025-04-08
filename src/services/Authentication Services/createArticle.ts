const baseUrl = import.meta.env.VITE_BASE_URL

const createArticle = async (articleData: { title: string; description: string; body: string; tagList: string[] }) => {
  const token = localStorage.getItem('token')
  if (!token) {
    throw new Error('Token не найден в localStorage!')
  }

  const response = await fetch(`${baseUrl}/articles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({ article: articleData }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error ? JSON.stringify(errorData.error) : 'Ошибка добавления статьи')
  }

  const data = await response.json()
  return data
}

export default createArticle
