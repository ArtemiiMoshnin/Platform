import { createSlice } from '@reduxjs/toolkit'
import { userState } from '../types'

const initialState: userState = {
  username: null,
  email: null,
  password: null,
  avatar: null,
  isLoggedIn: false,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { username, email, password, image } = action.payload
      state.username = username
      state.email = email
      state.password = password
      state.avatar = image
    },
    setLoginStatus: (state, action) => {
      state.isLoggedIn = action.payload
    },
  },
})

export const { setUser, setLoginStatus } = userSlice.actions

export default userSlice.reducer
