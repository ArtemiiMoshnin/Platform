import { useForm } from 'react-hook-form'
import { useHistory, Link } from 'react-router-dom'
import styles from '../../styles/SignUp.module.scss'
import { FormData } from '../../types'
import { signUp } from '../../services/Authentication Services/signUp'

const SignUp = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormData>()

  const history = useHistory()

  const onSubmit = async (data: FormData) => {
    try {
      await signUp({
        username: data.username,
        email: data.email,
        password: data.password,
      })
      history.push('/sign-in')
    } catch (err) {
      console.error('Ошибка?:', err)
    }
  }
  return (
    <main className={styles.signUpMain}>
      <div className={styles.container}>
        <h2 className={styles.title}>Create new account</h2>
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

          <label htmlFor="confirmPassword">Repeat Password</label>
          <input
            type="password"
            id="confirmPassword"
            {...register('confirmPassword', {
              required: 'Confirm Password is required',
              validate: (value) => value === getValues('password') || 'Passwords do not match',
            })}
            placeholder="Password"
          />
          {errors.confirmPassword && <p className={styles.error}>{errors.confirmPassword.message}</p>}

          <div className={styles.checkboxContainer}>
            <input type="checkbox" id="agree" name="agree" required />
            <label htmlFor="agree">I agree to the processing of my personal information</label>
          </div>

          <button type="submit" className={styles.button}>
            Create
          </button>
        </form>

        <p className={styles.signInText}>
          Already have an account? <Link to="/sign-in">Sign In.</Link>
        </p>
      </div>
    </main>
  )
}

export default SignUp
