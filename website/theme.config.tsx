import React from "react";
import { DocsThemeConfig, Link } from "nextra-theme-docs";

const config: DocsThemeConfig = {
    logo: <span>Alfonso Gracia-Saz's Calculus Materials</span>,
    project: {
        link: "https://github.com/siefkenj/alfonso-calculus-materials",
    },
    docsRepositoryBase:
        "https://github.com/siefkenj/alfonso-calculus-materials/tree/main/website",
    footer: {
        text: (
            <React.Fragment>
                Alfonso Gracia-Saz's Calculus Materials © 2020&nbsp;
                <Link href="https://creativecommons.org/licenses/by-sa/4.0/deed.en">
                    CC-BY-SA International 4.0
                </Link>
            </React.Fragment>
        ),
    },
    head: (
        <React.Fragment>
            <meta httpEquiv="Content-Language" content="en" />
            <meta
                name="description"
                content="Alfonso Gracia-Saz's Calculus Materials"
            />
            <meta
                property="og:description"
                content="Alfonso Gracia-Saz's Calculus Materials"
            />
        </React.Fragment>
    ),
    useNextSeoProps: () => ({
        titleTemplate: "%s – Alfonso's Calculus Materials",
    }),
    sidebar: { defaultMenuCollapseLevel: 1 },
};

export default config;
