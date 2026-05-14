import packageJson from '../package.json'

export default new Map<string, any>(
  [
    ['layout/default', {
      package: packageJson.name,
      payload: await import('./layout/default.liquid'),
    }],
    ['templates/home', {
      package: packageJson.name,
      payload: await import('./templates/home.liquid'),
    }],
    ['templates/page', {
      package: packageJson.name,
      payload: await import('./templates/page.liquid'),
    }],
    ['templates/submit', {
      package: packageJson.name,
      payload: await import('./templates/submit.liquid'),
    }],
  ]
)