const baseUrl = import.meta.env.VITE_BASE_URL

const updateAnArticle = async (
  articleData: { title: string; description: string; body: string; tagList: string[] },
  slug: string
) => {
  const token = localStorage.getItem('token')
  const response = await fetch(`${baseUrl}/articles/${slug}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({ article: articleData }),
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.errors ? JSON.stringify(errorData.errors) : 'Ошибка обновления статьи')
  } //Error ожидает строку. JSON.stringify cериализует объект errorData.errors, то есть превращает его в строку.  Сериализация — это превращение объекта в строку.
  const data = await response.json()
  return data
}

export default updateAnArticle
