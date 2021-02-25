const path = require('path');
const { readdirSync } = require('fs');

// Merges all metadata from subfolders under one JSON object type
const metadataFolderJsonPlugin = () =>
    readdirSync(path.resolve(__dirname, 'src', 'data', 'metadata'), { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => ({
            resolve: `gatsby-source-filesystem`,
            options: {
                path: path.join(path.join(__dirname, 'src', 'data', 'metadata'), d.name),
            },
        }));

module.exports = {
    pathPrefix: '/smtree',
    siteMetadata: {
        title: `SMTree`,
        description: `View family trees and character data from fan favorite Survival Multiplayer (SMP) worlds and Minecraft events.`,
        author: `mebird`,
        twitter: 'https://twitter.com/mebird_',
        reddit: 'https://www.reddit.com/user/mebird_',
        github: 'https://github.com/mebird',
        twitch: '',
        youtube: '',
    },
    plugins: [
        `gatsby-plugin-react-helmet`,
        `gatsby-plugin-typescript`,
        {
            resolve: `gatsby-plugin-google-fonts`,
            options: {
                fonts: [`Noto Sans`],
                display: 'swap',
            },
        },
        {
            resolve: 'gatsby-plugin-react-svg',
            options: {
                rule: {
                    include: /assets/,
                    omitKeys: [
                        'rdfResource',
                        'rdfAbout',
                        'xmlnsDc',
                        'xmlnsCc',
                        'xmlnsRdf',
                        'xmlnsSvg',
                        'xmlnsSodipodi',
                        'xmlnsInkscape',
                    ],
                },
            },
        },
        {
            resolve: `gatsby-plugin-layout`,
            options: {
                component: path.join(__dirname, 'src', 'components', 'layout', 'Layout.tsx'),
            },
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                path: path.join(__dirname, `src`, `images`, '/'),
            },
        },
        `gatsby-transformer-sharp`,
        `gatsby-plugin-sharp`,
        {
            resolve: `gatsby-plugin-manifest`,
            options: {
                name: `SMTree`,
                short_name: `SMTree`,
                start_url: `/`,
                background_color: `#FF8800`,
                theme_color: `#FF8800`,
                theme_color_in_head: false,
                icon: `src/images/tree.png`, // This path is relative to the root of the site.
            },
        },

        // Plugins to parse & process the project json data
        {
            resolve: `gatsby-transformer-json`,
            options: {
                typeName: ({ node: { absolutePath } }) =>
                    absolutePath.indexOf('/data/relationships') > -1
                        ? 'RelationshipData'
                        : absolutePath.indexOf('/data/metadata') > -1
                        ? 'CharacterMetadata'
                        : absolutePath.indexOf('/data/characters') > -1
                        ? 'CharacterData'
                        : 'SmpData',
            },
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                path: path.join(__dirname, 'src', 'data', '/'),
                ignore: [/.*\/metadata\/.*/g],
            },
        },
        ...metadataFolderJsonPlugin(),
    ],
};
