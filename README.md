# Saussure - Self-hosted Character Storage

A fancy, self-hosted alternative to websites such as Toyhouse or CharacterHub,
made in SvelteKit!

Intended to serve as a "headless CMS" to a frontend static website that you
design.

**If you're new, start by going to [the wiki](https://github.com/perappu/saussure/wiki) and opening up one of the starter guides.**

***

## Technical Stuff:

**Currently only works for GitHub as a backend and 11ty as a pre-configured
frontend**, but support for Forgejo/Gitea is planned. The SSG used should be
theoretically agnostic, but I plan to have pre-configured examples for other
popular options.

If you are connecting to GitHub, it can be simply utilized from
[this version](https://saussure.vercel.app) already hosted in the browser, as it
saves your settings in localStorage/cookies.

Alternatively, if you are connecting to Forgejo/Gitea (or you'd simply like to
save me some resources), you will need to run your own copy on Vercel, Netlify,
or another platform that supports serverless functions and configure the
environment variables accordingly. Saussure uses the auto-adapter, so as long as it is supported by the SvelteKit auto-adapter, then you will not need extra configuration for your platform of choice.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fperappu%2Fsaussure)

Or simply download it to your own computer and run it locally with npm.

Current rendering engines supported:

- Markdown (.md)
- Nunjucks (.njk)
- Liquid (.liquid)
- Handlebars (.hbs)
