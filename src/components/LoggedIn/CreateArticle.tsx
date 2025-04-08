import { useForm, useFieldArray } from 'react-hook-form'
import { useHistory } from 'react-router-dom'
import { useEffect } from 'react'
import { createArticleData } from '../../types'
import styles from '../../styles/CreateArticle.module.scss'
import createArticle from '../../services/Authentication Services/createArticle'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { fetchArticles } from '../../store/articlesSlice'

const CreateArticle = () => {
  const history = useHistory()
  const dispatch = useAppDispatch()
  const { currentPage } = useAppSelector((state) => state.articles)
  const { isLoggedIn } = useAppSelector((state) => state.user)

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<createArticleData>({
    defaultValues: {
      tags: [{ name: '' }],
    },
  })

  useEffect(() => {
    if (!isLoggedIn) {
      history.push('/sign-up')
    }
  }, [isLoggedIn, history])

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tags',
  })

  const onSubmit = async (data: createArticleData) => {
    try {
      await createArticle({
        title: data.title,
        description: data.description,
        body: data.text,
        tagList: data.tags?.map((tag) => tag.name) || [],
      })
      dispatch(fetchArticles(currentPage))
      history.push('/')
    } catch (err) {
      console.error('Ошибка?:', err)
    }
  }

  return (
    <main className={styles.createArticleMain}>
      <div className={styles.container}>
        <h2 className={styles.title}>Create new article</h2>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.inputGroup}>
            <label htmlFor="title" className={styles.label}>
              Title
            </label>
            <input
              type="text"
              id="title"
              {...register('title', {
                required: 'Title is required',
              })}
              placeholder="Title"
              className={styles.input}
            />
          </div>
          {errors.title && <p className={styles.error}>{errors.title.message}</p>}

          <div className={styles.inputGroup}>
            <label htmlFor="description" className={styles.label}>
              Short description
            </label>
            <input
              type="text"
              id="description"
              {...register('description', {
                required: 'Description is required',
              })}
              placeholder="Short description"
              className={styles.input}
            />
          </div>
          {errors.description && <p className={styles.error}>{errors.description.message}</p>}

          <div className={styles.inputGroup}>
            <label htmlFor="text" className={styles.label}>
              Text
            </label>
            <textarea
              placeholder="Text"
              id="text"
              {...register('text', {
                required: 'Text is required',
              })}
              className={styles.textarea}
            ></textarea>
          </div>
          {errors.text && <p className={styles.error}>{errors.text.message}</p>}

          <div className={styles.inputGroup}>
            <label>Tags</label>
            <div className={styles.tagInputContainer}>
              <ul className={styles.tagList}>
                {fields.map((field, index) => {
                  return (
                    <li className={styles.tagItem} key={field.id}>
                      <input
                        type="text"
                        {...register(`tags.${index}.name`)}
                        placeholder="Tag"
                        className={styles.input}
                      />
                      <button type="button" className={styles.deleteButton} onClick={() => remove(index)}>
                        Delete
                      </button>
                    </li>
                  )
                })}
              </ul>
              <button type="button" className={styles.addButtonForCreate} onClick={() => append({ name: '' })}>
                Add tag
              </button>
            </div>
          </div>

          <button type="submit" className={styles.sendButton}>
            Send
          </button>
        </form>
      </div>
    </main>
  )
}

export default CreateArticle
