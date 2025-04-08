import { useEffect } from 'react'
import { Pagination } from 'antd'
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router-dom'
import { fetchArticles } from '../store/articlesSlice'
import styles from '../styles/Main.module.scss'
import { useAppDispatch, useAppSelector } from '../hooks'
import { setPage } from '../store/articlesSlice'
import { shortenDescription } from '../utils'
import favoriteAnArticle from '../services/Authentication Services/favoriteAnArticle'
import heartImage from '../images/heart.png'
import Spiner from './Spiner'
import AuthorInfo from './AuthorInfo'

const Articles = () => {
  const dispatch = useAppDispatch()
  const history = useHistory()
  const { data, status, currentPage, total } = useAppSelector((state) => state.articles)
  const { isLoggedIn } = useAppSelector((state) => state.user)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchArticles(currentPage))
    }
  }, [status, currentPage])

  const handlePageChange = (page: number) => {
    dispatch(setPage(page))
    dispatch(fetchArticles(page))
  }

  const likeAnArticle = async (slug: string) => {
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

  return status === 'loading' ? (
    <Spiner />
  ) : (
    <main className={styles.mainContainer}>
      {data.map((article) => (
        <section key={article.slug}>
          <article>
            <div className={styles.headerContainer}>
              <div className={styles.topicContainer}>
                <div className={styles.topicName}>
                  <h2>
                    <Link to={`/articles/${article.slug}`}>{article.title}</Link>
                  </h2>
                  <button type="button" className={styles.likeButton} onClick={() => likeAnArticle(article.slug)}>
                    <img src={heartImage} alt="heart" />
                    {article.favoritesCount}
                  </button>
                </div>

                <ul className={styles.tagsContainer}>
                  {article.tagList.map((tag, index) => (
                    <li key={index}>{tag}</li>
                  ))}
                </ul>
              </div>

              <AuthorInfo author={article.author} date={article.createdAt} />
            </div>

            <div className={styles.shortenDescriptionContainer}>
              <p className={styles.shortenDescription}>{shortenDescription(article.description, 25)}</p>
            </div>
          </article>
        </section>
      ))}
      <Pagination
        current={currentPage}
        onChange={handlePageChange}
        pageSize={20}
        total={total}
        showSizeChanger={false}
        style={{ marginBottom: 17 }}
      />
    </main>
  )
}

export default Articles
