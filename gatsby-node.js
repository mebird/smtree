const { default: axios } = require('axios');
const axiosRetry = require('axios-retry');
const fs = require('fs');
const path = require('path');

const defaultUUID = '8667ba71-b85a-4004-af54-457a9734eed7';
const staticFolder = path.join(__dirname, 'static');

const getCrafatarUrl = (type, uuid) => {
    switch (type) {
        case 'head':
            return `https://crafatar.com/avatars/${uuid}?overlay&size=512`;
        case 'body':
            return `https://crafatar.com/renders/body/${uuid}?overlay&scale=10`;
    }
};

const getMcHeadsUrl = (type, uuid) => {
    uuid = uuid.replace('-', '');
    switch (type) {
        case 'head':
            return `https://mc-heads.net/avatar/${uuid}/512.png`;
        case 'body':
            return `https://mc-heads.net/body/${uuid}/right`;
    }
};

// Append image URLs onto each character to grab w/remote-images plugin
exports.onCreateNode = async ({ node, actions }) => {
    if (node.internal.type !== 'CharacterData') return;
    const { createNodeField } = actions;
    const uuid = node.uuid || defaultUUID;
    // we want to download & cache images in our static folder on this step
    //  because otherwise we load so many images from crafatar that we run into 503s
    //  and, as a result, the graph bugs tf out

    createNodeField({
        node,
        name: 'headSrc',
        value: getMcHeadsUrl('head', uuid),
    });

    createNodeField({
        node,
        name: 'bodySrc',
        value: getMcHeadsUrl('body', uuid),
    });
};

// Build FKRs.
exports.createSchemaCustomization = ({ actions }) => {
    const { createTypes } = actions;
    const typeDefs = `
      type RelationshipData implements Node {
        to: CharacterMetadata @link(by: "character_id", from: "to_id")
        from: CharacterMetadata @link(by: "character_id", from: "from_id")
        smp: SmpData @link(by: "smp_id", from: "smp_id")
      }
      type CharacterMetadata implements Node {
        smp: SmpData @link(by: "smp_id", from: "smp_id")
        character: CharacterData @link(by: "character_id", from: "character_id")
      }
      type CharacterData implements Node {
        smpMetadata: [CharacterMetadata] @link(by: "character_id", from: "character_id")
      }
      type SmpData implements Node {
        relationships: [RelationshipData] @link(by: "smp_id", from: "smp_id")
        characterMetadata: [CharacterMetadata] @link(by: "smp_id", from: "smp_id")
      }
    `;
    createTypes(typeDefs);
};

// Create a new page for each SMP
exports.createPages = async ({ graphql, actions }) => {
    const { createPage } = actions;
    const res = await graphql(`
        query SMPQuery {
            smps: allSmpData {
                nodes {
                    smp_id
                    name
                    max_lives
                    description
                    primary_color
                    secondary_color
                }
            }
        }
    `);

    if (res.errors) throw new Error(JSON.stringify(res.errors));

    const smpTemplate = require.resolve('./src/templates/SMPTree.tsx');
    res.data.smps.nodes.forEach(n =>
        createPage({
            path: `/${n.name.toLowerCase()}`,
            component: smpTemplate,
            context: n,
        })
    );
};

// Ignore issues with the graph hooks
exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
    if (stage === 'build-html') {
        actions.setWebpackConfig({
            module: {
                rules: [
                    {
                        test: /react-force-graph-2d/,
                        use: loaders.null(),
                    },
                ],
            },
        });
    }
};
