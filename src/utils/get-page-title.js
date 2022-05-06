import defaultSettings from '@/settings'

const title = defaultSettings.title || '毕业设计管理系统'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
