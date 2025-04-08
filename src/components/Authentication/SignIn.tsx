import { useForm } from 'react-hook-form'
import { useHistory, Link } from 'react-router-dom'
import styles from '../../styles/SignIn.module.scss'
import { FormData } from '../../types'
import { signIn } from '../../services/Authentication Services/signIn'
import { useAppDispatch } from '../../hooks'
import { setUser, setLoginStatus } from '../../store/userSlice'
import { getCurrentUser } from '../../services/Authentication Services/getCurrentUser'

const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  const history = useHistory()
  const dispatch = useAppDispatch()

  const onSubmit = async (data: FormData) => {
    try {
      await signIn({
        email: data.email,
        password: data.password,
      })
      const userData = await getCurrentUser()
      dispatch(setUser(userData.user))
      dispatch(setLoginStatus(true))
      history.push('/')
    } catch (err) {
      console.error('Ошибка?:', err)
    }
  }

  return (
    <main className={styles.signInMain}>
      <div className={styles.container}>
        <h2 className={styles.title}>Sign in</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
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

          <button type="submit" className={styles.button}>
            Login
          </button>
        </form>

        <p className={styles.signInText}>
          Don’t have an account? <Link to="/sign-up">Sign up.</Link>
        </p>
      </div>
    </main>
  )
}

export default SignIn
