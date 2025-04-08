import { useForm } from 'react-hook-form'
import { useHistory } from 'react-router-dom'
import { useEffect } from 'react'
import styles from '../../styles/EditProfile.module.scss'
import { FormData } from '../../types'
import { editProfile } from '../../services/Authentication Services/editProfile'
import { setUser } from '../../store/userSlice'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { fetchArticles } from '../../store/articlesSlice'

const EditProfile = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  const history = useHistory()
  const dispatch = useAppDispatch()
  const { currentPage } = useAppSelector((state) => state.articles)
  const { isLoggedIn } = useAppSelector((state) => state.user)

  useEffect(() => {
    if (!isLoggedIn) {
      history.push('/sign-up')
    }
  }, [isLoggedIn, history])

  const onSubmit = async (data: FormData) => {
    try {
      const userData = await editProfile({
        username: data.username,
        email: data.email,
        password: data.password,
        image: data.image || null,
      })
      dispatch(setUser(userData.user))
      dispatch(fetchArticles(currentPage))
      history.push('/')
    } catch (err) {
      console.error('Ошибка:', err)
    }
  }

  return (
    <main className={styles.editProfileMain}>
      <div className={styles.container}>
        <h2 className={styles.title}>Edit Profile</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            {...register('username', {
              required: 'Username is required',
              minLength: { value: 3, message: 'Minimum 3 characters' },
              maxLength: { value: 20, message: 'Maximum 20 characters' },
            })}
            placeholder="Username"
          />
          {errors.username && <p className={styles.error}>{errors.username.message}</p>}

          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^[a-z][a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]+$/, message: 'Invalid Email!' },
            })}
            placeholder="Email address"
          />
          {errors.email && <p className={styles.error}>{errors.email.message}</p>}

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Minimum 6 characters' },
              maxLength: { value: 40, message: 'Maximum 40 characters' },
            })}
            placeholder="Password"
          />
          {errors.password && <p className={styles.error}>{errors.password.message}</p>}

          <label htmlFor="image">Avatar image (url)</label>
          <input
            type="url"
            id="image"
            {...register('image', {
              pattern: {
                value: /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,4}\/?.*$/,
                message: 'Invalid URL format',
              },
            })}
            placeholder="Avatar image"
          />
          {errors.image && <p className={styles.error}>{errors.image.message}</p>}

          <button type="submit" className={styles.button}>
            Save
          </button>
        </form>
      </div>
    </main>
  )
}

export default EditProfile
