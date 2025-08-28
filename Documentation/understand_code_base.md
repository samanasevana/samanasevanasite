# Samaṇa Sevanā Website - Codebase Overview

This is a Buddhist monastery/dharma website built with **Astro**, a modern static site generator. The site is for "Samaṇa Sevanā," which appears to be a community space supporting the monastic path and Bhante Gunaviro in particular.

## Technology Stack

- **Framework**: Astro 5.1.0 (static site generator)
- **Styling**: Tailwind CSS
- **Content**: Markdown/MDX for content authoring
- **Language**: TypeScript
- **Additional**: RSS feeds, sitemap generation, code highlighting with Shiki

## Site Structure & Content Collections

The site uses Astro's content collections system with several organized sections:

1. **FAQ** (`src/content/faq/`) - Questions about monastic life
2. **Translations** (`src/content/translation/`) - Buddhist text translations
3. **Reflections** (`src/content/reflection/`) - Dharma reflections/teachings
4. **The Quality** (`src/content/thequality/`) - Specific teachings series
5. **Support** (`src/content/support/`) - Information on supporting monastics
6. **Pages** (`src/content/pages/`) - Static pages like About, Index

## Key Features

### 1. PDF Generation
The site automatically generates PDFs from markdown content via `scripts/generate-pdfs.js` using the `markdown-pdf` library. This creates downloadable dharma texts.

**Note**: The PDF conversion feature has been commented out after accordion components were added to pages.

### 2. Content Management
Uses Astro's type-safe content collections with schemas defined in `src/content/config.ts`:
- Ordered content (translations, thequality) with title, description, and order fields
- Simple content (reflections, support, faq) with just titles

### 3. Navigation Structure
- Main navigation with FAQ, Translations, Reflections sections
- Back navigation for individual posts in translations and "the quality" sections
- Theme toggle (dark/light mode)

## Content Organization

- **Static Assets**: Images of Bhante, Buddhist imagery in `public/static/`
- **Downloadable PDFs**: Pre-generated PDFs of dharma teachings in `public/pdfs/`
- **Fonts**: Custom Geist fonts for typography
- **Dynamic Content**: Upcoming dharma talks schedule, drop-in hours

## Build Process

The build process includes:
1. **PDF Generation**: Converts markdown content to PDFs
2. **Astro Check**: Type checking
3. **Static Build**: Generates the static site
4. **Code Formatting**: Prettier with Astro-specific plugins

## Key Configuration Files

### package.json
- Main dependencies: Astro, Tailwind CSS, MDX support
- Build scripts include PDF generation step
- Development dependencies for code formatting

### astro.config.mjs
- Integrates MDX, sitemap, and Tailwind
- Custom Shiki themes for code highlighting (Catppuccin)
- Site URL configuration

### src/consts.ts
- Global site configuration
- Site title: "Samaṇa Sevanā"
- Site URL: https://www.samanasevana.org
- Contact email and descriptions

## Project Structure

```
├── astro.config.mjs          # Astro configuration
├── package.json              # Dependencies and scripts
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
├── public/                  # Static assets
│   ├── fonts/              # Custom fonts (Geist)
│   ├── pdfs/               # Generated PDFs from markdown
│   └── static/             # Images and media
├── scripts/
│   └── generate-pdfs.js    # PDF generation script
└── src/
    ├── components/         # Reusable Astro components
    ├── content/           # Content collections
    │   ├── faq/           # FAQ entries
    │   ├── reflection/    # Dharma reflections
    │   ├── translation/   # Buddhist text translations
    │   ├── thequality/    # Teaching series
    │   ├── support/       # Support information
    │   └── pages/         # Static pages
    ├── layouts/           # Page layouts
    ├── pages/            # Route pages
    └── styles/           # Global CSS
```

## Current Site Content

The homepage displays:
- Upcoming dharma talks schedule with dates, times, and locations in San Jose area
- Drop-in hours information
- Images of Bhante Gunaviro
- Community information and contact details

## Development Notes

### Content Collections Schema

Each content type has a defined schema in `src/content/config.ts`:

```typescript
const translation = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    order: z.number(),
  }),
});

const faq = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
  }),
});
```

### PDF Generation Process

The `scripts/generate-pdfs.js` file:
- Reads markdown files from `src/content/reflection/` and `src/content/translation/`
- Converts them to PDFs using the `markdown-pdf` library
- Outputs PDFs to `public/pdfs/` directory
- Runs automatically during the build process

### Styling Approach

- Uses Tailwind CSS for utility-first styling
- Custom CSS in `src/styles/global.css`
- Dark/light theme support
- Responsive design with mobile-first approach

## Current Status

This appears to be an active dharma community website with:
- Regularly scheduled dharma talks
- Community support for Buddhist monastics
- Educational content including translations and teachings
- Modern web technologies for optimal user experience

The site serves as both an informational resource and a community hub for those interested in Buddhist teachings and supporting monastic life.
