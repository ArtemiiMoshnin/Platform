import { configureStore } from '@reduxjs/toolkit'
import articlesSlice from './articlesSlice'
import userSlice from './userSlice'

const store = configureStore({
  reducer: {
    articles: articlesSlice,
    user: userSlice,
  },
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
