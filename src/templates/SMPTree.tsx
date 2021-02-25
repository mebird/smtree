import { graphql, PageProps } from 'gatsby';
import React, { Suspense, useMemo } from 'react';
import LazyGraph from '../components/graph/LazyGraph';
import SEO from '../components/seo';
import IconText from '../components/textAndIcons/IconText';
import { SMPData, CharacterMetadata, CharacterWithContext } from '../Model';
import './SMPTree.css';

const SMPTree: React.FunctionComponent<SMPData> = (smpData: SMPData) => {
    const {
        smp: { name, description, primary_color },
    } = smpData;
    return (
        <>
            <SEO title={name} description={description} themeColor={primary_color} />
            <div className="smp-tree-text-wrapper fly-in">
                <IconText text={name.toUpperCase()} color={primary_color} />
            </div>
            {typeof window !== 'undefined' && (
                <Suspense fallback={null}>
                    <LazyGraph {...smpData} />
                </Suspense>
            )}
        </>
    );
};

// Takes page query data, pretty wraps it, and then passes it onto the main page
const SMPTreeWrapper = ({ data }: PageProps) => {
    const {
        smp,
        smp: { characterMetadata, relationships = [] },
    } = data as any;
    if (!relationships) smp.relationships = [];
    const componentProps = useMemo(
        () =>
            ({
                smp,
                characters: characterMetadata
                    .map((cm: CharacterMetadata) => ({ ...cm, ...cm.character }))
                    .map((c: CharacterWithContext) => ({ sort: Math.random(), value: c }))
                    .sort((a: any, b: any) => a.sort - b.sort)
                    .map((a: any) => a.value),
                relationships: relationships ?? [],
            } as SMPData),
        [data]
    );
    return SMPTree(componentProps);
};

/**
 * We use a page query w/ the smp id to grab all the data we'll need to load for this page.
 *  1. SMP & SMP Metadata
 *  2. Characters (which we'll later filter by ones that have metadata in the SMP)
 *  3. Relationships
 *
 * We'll use distinct queries to grab the following:
 *  1. Unique faction types
 *  2. Unique relationship types
 * Both of these metadata arrays will be returned sorted alphabetically
 *
 */

export const query = graphql`
    query SMPDataQuery($smp_id: Int! = 0) {
        smp: smpData(smp_id: { eq: $smp_id }) {
            description
            max_lives
            name
            primary_color
            secondary_color
            smp_id
            characterMetadata {
                character {
                    uuid
                    socials {
                        youtube
                        twitch
                        reddit
                        instagram
                        twitter
                        tiktok
                    }
                    name
                    ign
                    fields {
                        headSrc
                        bodySrc
                    }
                }
                character_id
                lives
                faction
                quote
                wins
            }
            relationships {
                from_id
                to_id
                type
                note
                season
                part
            }
        }
    }
`;

export default SMPTreeWrapper;
