import styles from '../styles/Author.module.scss'
import { formDate } from '../utils'

const AuthorInfo = ({ author, date }: { author: { username: string; image: string }; date: string }) => (
  <div className={styles.authorInfo}>
    <div className={styles.aurhorInfoContainer}>
      <address className={styles.authorName}>{author.username}</address>
      <time dateTime={date} className={styles.publicationDate}>
        {formDate(date)}
      </time>
    </div>
    <img className={styles.ava} src={author.image} alt={author.username} />
  </div>
)

export default AuthorInfo
