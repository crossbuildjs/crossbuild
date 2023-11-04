import { themes } from "prism-react-renderer"
const lightTheme = themes.github
const darkTheme = themes.dracula
import path from "path"

import type { Config } from "@docusaurus/types"
import type * as Preset from "@docusaurus/preset-classic"

const config: Config = {
    title: "CrossBuild",
    tagline: "Write your bot once, run on any* platform",
    favicon: "img/favicon.ico",

    // Set the production url of your site here
    url: "https://crossbuild.buape.com",
    // Set the /<baseUrl>/ pathname under which your site is served
    // For GitHub pages deployment, it is often '/<projectName>/'
    baseUrl: "/",

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: "crossbuildjs", // Usually your GitHub org/user name.
    projectName: "crossbuild", // Usually your repo name.

    onBrokenLinks: "throw",
    onBrokenMarkdownLinks: "warn",
    trailingSlash: false,

    // Even if you don't use internalization, you can use this field to set useful
    // metadata like html lang. For example, if your site is Chinese, you may want
    // to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: "en",
        locales: ["en"]
    },

    presets: [
        [
            "classic",
            {
                docs: {
                    sidebarPath: require.resolve("./sidebars.js"),
                    // Please change this to your repo.
                    // Remove this to remove the "edit this page" links.
                    editUrl:
                        "https://github.com/crossbuild/crossbuildjs/tree/main/apps/website/docs"
                },
                theme: {
                    customCss: require.resolve("./src/css/custom.css")
                }
            } satisfies Preset.Options
        ]
    ],

    themeConfig: {
        // Replace with your project's social card
        image: "img/docusaurus-social-card.jpg",
        navbar: {
            title: "CrossBuild",
            logo: {
                alt: "My Site Logo",
                src: "img/logo.svg"
            },
            items: [
                {
                    to: "api",
                    label: "API",
                    position: "left"
                },
                {
                    type: "docSidebar",
                    sidebarId: "tutorialSidebar",
                    position: "left",
                    label: "Docs"
                },
                {
                    href: "https://github.com/crossbuildjs/crossbuild",
                    className: "navbar-item-github",
                    position: "right"
                },
                {
                    href: "https://go.buape.com/discord",
                    className: "navbar-item-discord",
                    position: "right"
                }
            ]
        },

        prism: {
            theme: lightTheme,
            darkTheme: darkTheme
        }
    } satisfies Preset.ThemeConfig,

    plugins: [
        [
            "docusaurus-plugin-typedoc-api",
            {
                projectRoot: path.join(__dirname, "../.."),
                packages: ["core", "crossbuild", "discord", "guilded"].map(
                    (x) => `packages/${x}`
                ),
                tsconfigName: "tsconfig.base.json"
            }
        ]
    ]
}

module.exports = config
