import { useStaticQuery, graphql } from 'gatsby';
import { SMP } from '../Model';

export const query = graphql`
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
`;

export default (): SMP[] => useStaticQuery(query).smps.nodes;
