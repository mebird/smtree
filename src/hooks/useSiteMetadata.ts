import { useStaticQuery, graphql } from 'gatsby';

export const query = graphql`
    query LayoutQuery {
        site {
            siteMetadata {
                twitter
                reddit
                github
                author
                youtube
            }
        }
    }
`;

export default () => useStaticQuery(query).site.siteMetadata;
