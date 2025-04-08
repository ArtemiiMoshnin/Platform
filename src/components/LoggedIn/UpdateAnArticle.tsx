import { useForm, useFieldArray } from 'react-hook-form'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useHistory } from 'react-router-dom'
import { createArticleData } from '../../types'
import styles from '../../styles/CreateArticle.module.scss'
import { useAppSelector, useAppDispatch } from '../../hooks'
import { fetchArticleBySlug } from '../../store/articlesSlice'
import { fetchArticles } from '../../store/articlesSlice'
import updateAnArticle from '../../services/Authentication Services/updateAnArticle'

const UpdateAnArticle = () => {
  const { slug } = useParams<{ slug: string }>()
  const { currentArticle, currentPage } = useAppSelector((state) => state.articles)
  const { isLoggedIn } = useAppSelector((state) => state.user)
  const dispatch = useAppDispatch()
  const history = useHistory()

  useEffect(() => {
    dispatch(fetchArticleBySlug(slug))
  }, [slug])

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<createArticleData>({
    defaultValues: {
      tags: [{ name: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tags',
  })

  useEffect(() => {
    if (!isLoggedIn) {
      history.push('/sign-up')
    }

    if (currentArticle) {
      setValue('title', currentArticle.title)
      setValue('description', currentArticle.description)
      setValue('text', currentArticle.body)
      setValue('tags', currentArticle.tagList?.map((tag) => ({ name: tag })) || [])
    }
  }, [isLoggedIn, currentArticle, history])

  const onSubmit = async (data: createArticleData) => {
    try {
      await updateAnArticle(
        {
          title: data.title,
          description: data.description,
          body: data.text,
          tagList: data.tags?.map((tag) => tag.name) || [],
        },
        slug
      )
      dispatch(fetchArticles(currentPage))
      history.push(`/articles/${slug}`)
    } catch (err) {
      console.error('Ошибка при обновлении статьи:', err)
    }
  }

  return (
    <main className={styles.createArticleMain}>
      <div className={styles.container}>
        <h2 className={styles.title}>Edit article</h2>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
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
            <label htmlFor="tags" className={styles.label}>
              Tags
            </label>
            <div className={styles.tagInputContainer}>
              <ul className={styles.tagList}>
                {fields.map((field, index) => (
                  <li className={styles.tagItem} key={field.id}>
                    <input type="text" {...register(`tags.${index}.name`)} placeholder="Tag" className={styles.input} />
                    <button type="button" className={styles.deleteButton} onClick={() => remove(index)}>
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
              <button type="button" className={styles.addButtonForCreate} onClick={() => append({ name: '' })}>
                Add tag
              </button>
            </div>
          </div>

          <button type="submit" className={styles.sendButton}>
            Save changes
          </button>
        </form>
      </div>
    </main>
  )
}

export default UpdateAnArticle
