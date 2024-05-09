// @ts-check

const { themes } = require('prism-react-renderer');
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'dash.',
  tagline: 'a modern server dashboard',
  url: 'https://getdashdot.com',
  baseUrl: '/',
  trailingSlash: false,
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'MauriceNino',
  projectName: 'dashdot',

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/MauriceNino/dashdot/edit/main/apps/docs',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'dash.',
        logo: {
          alt: 'Logo',
          src: 'img/logo512.png',
        },
        items: [
          {
            type: 'doc',
            docId: 'installation/index',
            position: 'left',
            label: 'Documentation',
          },
          {
            href: 'https://dash.mauz.dev',
            label: 'Demo',
            position: 'left',
          },
          {
            href: 'https://ko-fi.com/mauricenino',
            label: 'Donate on Ko-Fi',
            position: 'right',
          },
          {
            href: 'https://github.com/MauriceNino/dashdot',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Help',
            items: [
              {
                label: 'Installation',
                to: 'docs/installation',
              },
              {
                label: 'Configuration',
                to: 'docs/configuration/basic',
              },
              {
                label: 'Changelog',
                href: 'https://github.com/MauriceNino/dashdot/blob/main/.github/CHANGELOG.md',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Discord',
                href: 'https://discord.gg/3teHFBNQ9W',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/MauriceNino/dashdot',
              },
            ],
          },
        ],
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['bash', 'json', 'yaml'],
      },
      colorMode: {
        defaultMode: 'dark',
        respectPrefersColorScheme: false,
      },
      zoom: {
        selector: 'img',
        config: {
          background: {
            light: 'rgb(255, 255, 255)',
            dark: 'rgb(50, 50, 50)',
          },
        },
      },
    }),

  themes: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        indexBlog: false,
      },
    ],
  ],

  plugins: [
    'docusaurus-plugin-sass',
    require.resolve('docusaurus-plugin-image-zoom'),
  ],
};

module.exports = config;
