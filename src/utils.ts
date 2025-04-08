import { format } from 'date-fns'

export const shortenDescription = (description: string, maxLength: number): string => {
  const wordsArray = description.split(' ')

  if (wordsArray.length <= maxLength) {
    return description
  }

  const newArray = wordsArray.slice(0, maxLength)
  const newDescription = newArray.join(' ')
  return `${newDescription} ...`
}

export const formDate = (date: string) => {
  return format(new Date(date), 'MMMM d, yyyy')
}
