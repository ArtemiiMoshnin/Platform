import { ArticlesResponse } from '../types'

const baseUrl = import.meta.env.VITE_BASE_URL

const getArticlesGlobally = async (page: number): Promise<ArticlesResponse> => {
  const response = await fetch(`${baseUrl}/articles?offset=${(page - 1) * 20}`)

  if (!response.ok) {
    throw new Error('Ошибка при получении статей')
  }

  const data: ArticlesResponse = await response.json()
  return data
}

// Функция для получения одной статьи по slug
const getArticleBySlug = async (slug: string) => {
  const response = await fetch(`${baseUrl}/articles/${slug}`)

  if (!response.ok) {
    throw new Error('Ошибка при получении статьи')
  }

  const data = await response.json()
  return data.article // Предполагаем, что API возвращает одну статью
}

export { getArticlesGlobally, getArticleBySlug }

//На странице 1: (1 - 1) * 20 = 0 (начинаем с первой статьи)
//На странице 2: (2 - 1) * 20 = 20 (пропускаем первые 20 статей)
//На странице 3: (3 - 1) * 20 = 40 (пропускаем первые 40 статей)
//Offset сам по себе делает skip number of articles
