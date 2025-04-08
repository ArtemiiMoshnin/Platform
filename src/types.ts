// Тип для статьи
export type Article = {
  slug: string
  title: string
  description: string
  body: string
  tagList: string[]
  createdAt: string
  updatedAt: string
  favorited: boolean
  favoritesCount: number
  author: {
    username: string
    bio: string
    image: string
    following: boolean
  }
}

// Тип для ответа от сервера.
export type ArticlesResponse = {
  articles: Article[]
  articlesCount: number
}

export type ArticlesState = {
  data: Article[]
  status: 'idle' | 'loading' | 'resolved' | 'rejected'
  currentPage: number
  total: number
  currentArticle: null | Article
}

export interface userState {
  username: string | null
  email: string | null
  password: string | null
  avatar: string | null
  isLoggedIn: boolean | null
}

export interface FormData {
  username: string
  email: string
  password: string
  confirmPassword: string
  agree: boolean
  image: string | null
}

export interface createArticleData {
  title: string
  description: string
  text: string
  tags: { name: string }[]
}
