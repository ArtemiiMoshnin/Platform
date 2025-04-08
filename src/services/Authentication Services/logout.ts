import { useAppDispatch } from '../../hooks'
import { setLoginStatus } from '../../store/userSlice'

const useLogout = () => {
  const dispatch = useAppDispatch()

  return () => {
    localStorage.removeItem('token')
    dispatch(setLoginStatus(false))
  }
}

export default useLogout
