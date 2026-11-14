import nextra from "nextra";

const isGithubActions = process.env.GITHUB_ACTIONS || false;

// On GitHub Pages the site is served from /<repo>/.
let basePath = "";
if (isGithubActions) {
    // trim off `<owner>/`
    basePath = `/${process.env.GITHUB_REPOSITORY.replace(/.*?\//, "")}`;
}

// No custom remark plugins: ```math blocks are rendered by Nextra itself, and
// the questions' LaTeX is highlighted by components/question-preview.tsx.
// Function-valued plugins would also rule out Turbopack, which cannot pass
// them to a loader.
const withNextra = nextra({
    latex: true,
});

export default withNextra({
    output: "export",
    images: {
        unoptimized: true,
    },
    basePath,
    // `npm run dev` listens on 0.0.0.0 so the site can be opened from outside
    // a dev container, but Next only lets `localhost` pages use its dev
    // resources (hot reload and the like). Also allow private-network
    // addresses, and any hosts listed in DEV_ORIGINS (comma-separated).
    allowedDevOrigins: [
        "10.*.*.*",
        "172.*.*.*",
        "192.168.*.*",
        "*.local",
        ...(process.env.DEV_ORIGINS?.split(",") ?? []),
    ],
    env: {
        // Client code that builds URLs by hand (question images, downloads)
        // reads this; `next/navigation` has no basePath hook.
        NEXT_PUBLIC_BASE_PATH: basePath,
    },
});
