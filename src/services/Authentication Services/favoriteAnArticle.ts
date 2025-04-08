const baseUrl = import.meta.env.VITE_BASE_URL

const favoriteAnArticle = async (slug: string) => {
  const token = localStorage.getItem('token')
  const response = await fetch(`${baseUrl}/articles/${slug}/favorite`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.errors ? JSON.stringify(errorData.errors) : 'Ошибка обновления статьи')
  }
  const data = await response.json()
  return data
}

export default favoriteAnArticle
