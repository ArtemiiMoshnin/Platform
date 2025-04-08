const baseUrl = import.meta.env.VITE_BASE_URL

const deleteAnArticle = async (slug: string) => {
  const token = localStorage.getItem('token')
  const response = await fetch(`${baseUrl}/articles/${slug}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.errors ? JSON.stringify(errorData.errors) : 'Ошибка обновления статьи')
  }
}

export default deleteAnArticle
