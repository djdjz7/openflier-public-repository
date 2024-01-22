import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "OpenFlier",
  description: "OpenFlier Public Repository",
  
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config

    logo: '/icon.png',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Documentation', link: '/docs/getting-started' },
      { text: "Acknowledgements", link: '/acknowledgements/'}
    ],

    sidebar: [
      {
        text: 'Documentation',
        items: [
          { text: 'Getting Started', link: '/docs/getting-started' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/djdjz7/OpenFlier' }
    ],
  },
})
