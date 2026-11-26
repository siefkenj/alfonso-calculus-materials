import type { Metadata } from "next";
import { Footer, Layout, Navbar } from "nextra-theme-docs";
import { Head } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import "nextra-theme-docs/style.css";
import "./globals.css";
import { SidebarSettings } from "../components/sidebar-settings";

export const metadata: Metadata = {
    title: {
        default: "Alfonso Gracia-Saz's Calculus Materials",
        template: "%s – Alfonso's Calculus Materials",
    },
    description: "Alfonso Gracia-Saz's Calculus Materials",
    openGraph: {
        description: "Alfonso Gracia-Saz's Calculus Materials",
    },
};

const navbar = (
    <Navbar
        logo={<span>Alfonso Gracia-Saz's Calculus Materials</span>}
        projectLink="https://github.com/siefkenj/alfonso-calculus-materials"
    />
);

const footer = (
    <Footer>
        Alfonso Gracia-Saz's Calculus Materials © 2020&nbsp;
        <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.en">
            CC-BY-SA International 4.0
        </a>
    </Footer>
);

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" dir="ltr" suppressHydrationWarning>
            <Head />
            <body>
                <Layout
                    navbar={navbar}
                    footer={footer}
                    pageMap={await getPageMap()}
                    docsRepositoryBase="https://github.com/siefkenj/alfonso-calculus-materials/tree/main/website"
                    sidebar={{ defaultMenuCollapseLevel: 1 }}
                >
                    {children}
                </Layout>
                <SidebarSettings />
            </body>
        </html>
    );
}
