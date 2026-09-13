# Deploying to Cloudflare Pages

FreeMermaid is a static Vite application. It does not use Pages Functions, Worker bindings, environment variables, secrets, a database, or an API.

## One-time setup

1. Push this repository to GitHub.
2. In Cloudflare, open **Workers & Pages** and create a Pages project by connecting the GitHub repository.
3. Configure the production branch and build settings:

   | Setting | Value |
   | --- | --- |
   | Production branch | `main` |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Node version | `22` |

4. Save the configuration and deploy.

Cloudflare Pages publishes commits on `main` to production and creates preview deployments for pull requests. See Cloudflare’s [Git integration guide](https://developers.cloudflare.com/pages/get-started/git-integration/) for account and repository connection details.

## What is deployed

`npm run build` generates the static `dist/` directory. It includes the application, Mermaid’s bundled diagram modules, web app manifest, service worker, Workbox runtime, icons, and the `_headers` configuration copied from `public/`.

Because FreeMermaid bundles the full Mermaid distribution, the first cached download is larger than a typical small static page. That cost is intentional: it enables the full diagram set offline after installation.

## Headers and caching

`public/_headers` is deployed as `_headers` and applies only to static assets. It sets a same-origin-focused Content Security Policy, blocks framing and MIME sniffing, limits browser permissions, caches hashed assets immutably, and keeps HTML and service-worker files revalidatable.

Do not remove the `style-src 'unsafe-inline'` allowance without testing Mermaid rendering: generated SVG styles require it. Review Cloudflare’s [_headers documentation](https://developers.cloudflare.com/pages/configuration/headers/) before changing header syntax or policy.

## Verify a deployment

1. Open the Pages URL online and confirm the starter preview renders.
2. Change the source, reload, and confirm the draft is restored.
3. Download source, SVG, and PNG.
4. After the service worker has installed, switch the browser offline and reload the page.
5. Create a pull request and inspect the Pages preview before merging.

If the app fails to build in Pages, verify the Node version and build/output settings first. See [troubleshooting](troubleshooting.md) for more checks.
