import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getArticlesGlobally, getArticleBySlug } from '../services/articlesService'
import { ArticlesState } from '../types'

export const fetchArticles = createAsyncThunk('articles/fetch', async (page: number) => {
  const { articles, articlesCount } = await getArticlesGlobally(page)
  return { articles, articlesCount }
})

export const fetchArticleBySlug = createAsyncThunk('articles/fetchArticleBySlug', async (slug: string) => {
  const article = await getArticleBySlug(slug)
  return { article }
})

const initialState: ArticlesState = {
  data: [],
  status: 'idle',
  currentPage: 1,
  total: 0,
  currentArticle: null,
}

const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.currentPage = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.status = 'resolved'
        state.data = action.payload.articles
        state.total = action.payload.articlesCount
      })
      .addCase(fetchArticles.rejected, (state) => {
        state.status = 'rejected'
      })

      .addCase(fetchArticleBySlug.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchArticleBySlug.fulfilled, (state, action) => {
        state.status = 'resolved'
        state.currentArticle = action.payload.article
      })
      .addCase(fetchArticleBySlug.rejected, (state) => {
        state.status = 'rejected'
      })
  },
})

export const { setPage } = articlesSlice.actions

export default articlesSlice.reducer
