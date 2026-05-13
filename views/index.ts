import packageJson from '../package.json'

export default new Map<string, any>(
  [
    ['layout/default', {
      package: packageJson.name,
      payload: await import('./layout/default.liquid'),
    }],
    ['sections/dev-footer', {
      package: packageJson.name,
      payload: await import('./sections/dev-footer.liquid'),
    }],
    ['sections/footnote', {
      package: packageJson.name,
      payload: await import('./sections/footnote.liquid'),
    }],
    ['sections/header', {
      package: packageJson.name,
      payload: await import('./sections/header.liquid'),
    }],
    ['sections/hero', {
      package: packageJson.name,
      payload: await import('./sections/hero.liquid'),
    }],
    ['sections/paragraphs', {
      package: packageJson.name,
      payload: await import('./sections/paragraphs.liquid'),
    }],
    ['templates/error', {
      package: packageJson.name,
      payload: await import('./templates/error.liquid'),
    }],
    ['templates/page', {
      package: packageJson.name,
      payload: await import('./templates/page.json'),
    }],
  ]
)