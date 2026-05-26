import packageJson from '../package.json'

export default new Map<string, any>([
  ['layout/default',              { package: packageJson.name, payload: await import('./layout/default.liquid') }],
  ['sections/dev-footer',         { package: packageJson.name, payload: await import('./sections/dev-footer.liquid') }],
  ['sections/footnote',           { package: packageJson.name, payload: await import('./sections/footnote.liquid') }],
  ['sections/header',             { package: packageJson.name, payload: await import('./sections/header.liquid') }],
  ['sections/hero',               { package: packageJson.name, payload: await import('./sections/hero.liquid') }],
  ['sections/paragraphs',         { package: packageJson.name, payload: await import('./sections/paragraphs.liquid') }],
  ['snippets/edit_belongs',       { package: packageJson.name, payload: await import('./snippets/edit_belongs.liquid') }],
  ['snippets/edit_fields',        { package: packageJson.name, payload: await import('./snippets/edit_fields.liquid') }],
  ['snippets/edit_filter',        { package: packageJson.name, payload: await import('./snippets/edit_filter.liquid') }],
  ['snippets/edit_has_many',      { package: packageJson.name, payload: await import('./snippets/edit_has_many.liquid') }],
  ['snippets/edit_many',          { package: packageJson.name, payload: await import('./snippets/edit_many.liquid') }],
  ['snippets/logo',               { package: packageJson.name, payload: await import('./snippets/logo.liquid') }],
  ['snippets/head/tailwindcss',   { package: packageJson.name, payload: await import('./snippets/head/tailwindcss.liquid') }],
  ['templates/error',             { package: packageJson.name, payload: await import('./templates/error.liquid') }],
])
