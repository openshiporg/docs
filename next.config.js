// const { remarkCodeHike } = require("@code-hike/mdx");
// const theme = require("shiki/themes/nord.json");
// const withNextra = require("nextra")({
//   theme: "nextra-theme-docs",
//   themeConfig: "./theme.config.js",
//   unstable_staticImage: true,
// });

// const withMDX = require("@next/mdx")({
//   extension: /\.mdx?$/,
//   options: {
//     remarkPlugins: [[remarkCodeHike, { theme }]],
//   },
// });

// module.exports = withMDX({
//   pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
//   eslint: { ignoreDuringBuilds: true },
// });

const { remarkCodeHike } = require("@code-hike/mdx");
const theme = require("shiki/themes/material-ocean.json");

const withNextra = require("nextra")({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.js",
  mdxOptions: {
    remarkPlugins: [
      [
        remarkCodeHike,
        { theme, staticMediaQuery: "not screen, (max-width: 1080px)" },
      ],
    ],
  },
  unstable_flexsearch: true,
  unstable_staticImage: true,
  // unstable_staticImage: true
});
module.exports = withNextra({
  images: {
    domains: ["pbs.twimg.com", "avatars.githubusercontent.com", "i.imgur.com"],
  },
});
