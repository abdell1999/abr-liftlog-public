self.addEventListener('notificationclick', event => {
  if (!event.notification.tag.startsWith('liftlog-rest-')) return
  event.notification.close()
  event.waitUntil((async () => {
    const candidate = new URL(event.notification.data?.url || self.registration.scope, self.registration.scope)
    const target = candidate.href.startsWith(self.registration.scope) ? candidate.href : self.registration.scope
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
    const existing = windows.find(client => client.url.startsWith(self.registration.scope))
    if (existing) {
      if (existing.url !== target) await existing.navigate(target)
      await existing.focus()
    } else await self.clients.openWindow(target)
  })())
})
