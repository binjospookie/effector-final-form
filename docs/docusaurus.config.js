module.exports = {
  title: '☄️ effector final form',
  url: 'https://binjospookie.github.io',
  baseUrl: '/effector-final-form',
  onBrokenLinks: 'warn',
  projectName: 'effector-final-form',
  organizationName: 'binjospookie',
  deploymentBranch: 'master',
  markdown: {
    // othervise we lost ```mermaid file=...``` syntax
    mermaid: false,
  },
  staticDirectories: ['static'],
  themes: ['@docusaurus/theme-live-codeblock'],
  themeConfig: {
    navbar: {
      title: '☄️ Effector + Final Form 🏁',
      items: [
        {
          href: '/docs/installation',
          position: 'left',
          label: 'Installation',
        },
        {
          href: 'https://stackblitz.com/edit/react-ts-xjh6yd?file=index.tsx',
          position: 'left',
          label: 'Demo',
        },
        {
          href: 'https://github.com/binjospookie/effector-final-form',
          position: 'right',
          label: 'GitHub',
        },
      ],
    },
    prism: {
      defaultLanguage: 'typescript',
      theme: require('prism-react-renderer/themes/vsDark'),
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          include: ['docs/**/*.mdx'],
          exclude: ['**/node_modules/**'],
          path: './',
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/',
          showLastUpdateAuthor: false,
          showLastUpdateTime: false,
          remarkPlugins: [require('remark-code-import'), require('mdx-mermaid')],
          breadcrumbs: false,
          sidebarCollapsible: true,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
