export const formatDate = (date: string): string => {
  const instance = new Date(date).toDateString().replace(' ', ', ')
  return `${instance}`
}
