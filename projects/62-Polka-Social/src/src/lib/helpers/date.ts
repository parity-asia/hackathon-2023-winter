import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export function getRelativeDateFromNow(
  date?: Date | string | number,
  defaultValue?: string
) {
  if (!date) return defaultValue ?? '-'
  return dayjs(date).fromNow()
}

export function formatDate(
  date?: Date | string | number,
  format = 'MMM DD, YYYY [at] h:mm',
  defaultValue?: string
) {
  if (!date) return defaultValue ?? '-'
  return dayjs(date).format(format)
}
