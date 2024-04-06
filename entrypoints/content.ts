import { createApp } from 'vue'
import App from './Contents.vue'

export default defineContentScript({
  matches: ['<all_urls>'],

  main(ctx) {
    const ui = createIntegratedUi(ctx, {
      position: 'inline',
      anchor: 'body',
      append: 'last',
      onMount: (container) => {
        // Create the app and mount it to the UI container
        container.id = 'bcz-lgelpdnoogahffdkigeeonhggglogabb'
        const app = createApp(App)
        app.mount(container)
        return app
      },
      onRemove: (app) => {
        // Unmount the app when the UI is removed
        app?.unmount()
      },
    })

    // Call mount to add the UI to the DOM
    ui.mount()
  },
})
