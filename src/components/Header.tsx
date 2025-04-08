import { useHistory } from 'react-router-dom'
import { useEffect } from 'react'
import styles from '../styles/Header.module.scss'
import { useAppSelector, useAppDispatch } from '../hooks'
import profile from '../images/profile.svg'
import useLogout from '../services/Authentication Services/logout'
import { getCurrentUser } from '../services/Authentication Services/getCurrentUser'
import { setUser, setLoginStatus } from '../store/userSlice'

const Header = () => {
  const history = useHistory()
  const { isLoggedIn, username, avatar } = useAppSelector((state) => state.user)
  const dispatch = useAppDispatch()
  const handleLogout = useLogout()

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token')

      if (!token) {
        return
      }

      try {
        const userData = await getCurrentUser()
        dispatch(setUser(userData.user))
        dispatch(setLoginStatus(true))
      } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error)
      }
    }
    fetchUser()
  }, [])

  return (
    <>
      <header>
        <div className={styles.headerContainer}>
          <button className={styles.toMainButton} onClick={() => history.push('/')}>
            <span className={styles.websiteName}>Realworld Blog</span>
          </button>
          <div className={[styles.buttonsContainer, isLoggedIn ? styles.gaps : ''].join(' ')}>
            {isLoggedIn ? (
              <>
                <button
                  type="button"
                  className={styles.createArticleButton}
                  onClick={() => history.push('/new-article')}
                >
                  Create Article
                </button>
                <button type="button" className={styles.profileButton} onClick={() => history.push('/edit-profile')}>
                  <span>{username}</span>
                  <img src={avatar || profile} alt="avatar" />
                </button>
                <button type="button" onClick={handleLogout} className={styles.logoutButton}>
                  Log Out
                </button>
              </>
            ) : (
              <>
                <button type="button" className={styles.signInButton} onClick={() => history.push('/sign-in')}>
                  Sign In
                </button>
                <button type="button" className={styles.signUpButton} onClick={() => history.push('/sign-up')}>
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  )
}

export default Header
