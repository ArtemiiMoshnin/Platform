import { useParams, useHistory } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { useEffect } from 'react'
import { Popconfirm } from 'antd'
import { shortenDescription } from '../utils'
import styles from '../styles/Article.module.scss'
import heartImage from '../images/heart.png'
import { fetchArticleBySlug } from '../store/articlesSlice'
import { fetchArticles } from '../store/articlesSlice'
import deleteAnArticle from '../services/Authentication Services/deleteAnArticle'
import { useAppSelector, useAppDispatch } from '../hooks'
import favoriteAnArticle from '../services/Authentication Services/favoriteAnArticle'
import AuthorInfo from './AuthorInfo'
import Spiner from './Spiner'

const Article = () => {
  const { data, status, currentPage, currentArticle } = useAppSelector((state) => state.articles)
  const { username, isLoggedIn } = useAppSelector((state) => state.user)
  const dispatch = useAppDispatch()
  const { slug } = useParams<{ slug: string }>()
  const history = useHistory()

  const article = data.find((item) => item.slug === slug)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchArticles(currentPage))
      dispatch(fetchArticleBySlug(slug))
    }
  }, [])

  const likeAnArticle = async () => {
    if (isLoggedIn) {
      try {
        await favoriteAnArticle(slug)
        dispatch(fetchArticles(currentPage))
      } catch (error) {
        console.error('Ошибка like:', error)
      }
    } else {
      history.push('/sign-up')
    }
  }

  const deleteArticle = async () => {
    try {
      await deleteAnArticle(slug)
      history.push('/')
      dispatch(fetchArticles(currentPage))
    } catch (error) {
      console.error('Ошибка delete:', error)
    }
  }

  if (status === 'loading') return <Spiner />

  const selectedArticle = article || currentArticle
  if (!selectedArticle) return <p>Статья не найдена</p>

  return (
    <main className={styles.mainContainer}>
      <article>
        <section>
          <div className={styles.headerContainer}>
            <div className={styles.topicContainer}>
              <div className={styles.topicName}>
                <h2>{selectedArticle.title}</h2>
                <button type="button" onClick={likeAnArticle} className={styles.likeButton}>
                  <img src={heartImage} alt="heart" />
                  {selectedArticle.favoritesCount}
                </button>
              </div>
              <ul className={styles.tagsContainer}>
                {selectedArticle.tagList.map((tag, index) => (
                  <li key={index}>{tag}</li>
                ))}
              </ul>
            </div>

            <AuthorInfo author={selectedArticle.author} date={selectedArticle.createdAt} />
          </div>

          <div className={styles.shortenDescriptionContainer}>
            <p className={styles.shortenDescription}>{shortenDescription(selectedArticle.description, 25)}</p>

            {selectedArticle.author.username === username && (
              <div className={styles.articleActions}>
                <Popconfirm
                  title="Are you sure to delete this article?"
                  onConfirm={deleteArticle}
                  okText="Yes"
                  cancelText="No"
                >
                  <button className={styles.deleteButton}>Delete</button>
                </Popconfirm>
                <button onClick={() => history.push(`/articles/${slug}/edit`)} className={styles.editButton}>
                  Edit
                </button>
              </div>
            )}
          </div>
        </section>

        <div className={styles.bodyDescription}>
          <ReactMarkdown>{selectedArticle.body}</ReactMarkdown>
        </div>
      </article>
    </main>
  )
}

export default Article
