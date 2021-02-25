import { useStaticQuery, graphql } from 'gatsby';

export const query = graphql`
    query HeartImageQuery {
        site {
            siteMetadata {
                twitter
                reddit
                github
                author
            }
        }
    }
`;

export default () => useStaticQuery(query).site.siteMetadata;
