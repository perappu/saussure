# Saussure - Self-hosted Character Storage

A fancy, self-hosted alternative to websites such as Toyhouse or CharacterHub,
made in SvelteKit!

Intended to serve as a "headless CMS" to a frontend static website that you
design.

Currently only works for GitHub as a backend and 11ty as a pre-configured frontend, but support
for Forgejo/Gitea is planned. The SSG used should be theoretically agnostic, but I plan to have pre-configured examples for other popular options.

If you are connecting to GitHub, it can be simply utilized from
[this version](https://saussure.vercel.app) already hosted in the browser, as it
saves your settings in localStorage/cookies.

Alternatively, if you are connecting to Forgejo/Gitea (or you'd simply like to
save me some resources), you will need to run your own copy on Vercel, Netlify,
or another platform that supports serverless functions and configure the environment variables accordingly.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fperappu%2Fsaussure)

Or simply download it to your own computer and run it locally with npm.

Start by cloning a repository such as [this one](https://github.com/perappu/saussure-11ty), or configure your own. Then
log in, configure your settings, and you're good to go!

Current rendering engines supported

- Markdown (.md)
- Nunjucks (.njk)
- Liquid (.liquid)
- Handlebars (.hbs)
