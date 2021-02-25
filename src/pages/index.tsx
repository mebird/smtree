import React from 'react';
import SMPNavMenu from '../components/navMenu/NavMenu';

import SEO from '../components/seo';
import './index.css';

const IndexPage = () => (
    <div className="homepage-content">
        <SEO title="Home" description="Interactive visualizations for Minecraft series/events." />
        <SMPNavMenu />
    </div>
);
export default IndexPage;
