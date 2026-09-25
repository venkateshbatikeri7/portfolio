import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const URL = process.env.TARGET_URL ?? 'http://localhost:5199/'
const OUT = 'shots'
mkdirSync(OUT, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'shell',
  args: [
    '--no-sandbox',
    '--enable-unsafe-swiftshader',
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--enable-webgl',
    '--window-size=1600,1000',
  ],
})

const page = await browser.newPage()
await page.setViewport({ width: 1600, height: 1000, deviceScaleFactor: 1 })

const errors = []
const warnings = []
const logs = []

page.on('console', async (msg) => {
  const type = msg.type()
  const text = msg.text()
  if (type === 'error') errors.push(text)
  else if (type === 'warning' || type === 'warn') warnings.push(text)
  else logs.push(`[${type}] ${text}`)

  // React prints the component stack as a separate console arg.
  if (text.includes('An error occurred') || text.includes('The above error')) {
    try {
      const extra = await Promise.all(
        msg.args().map((a) => a.jsonValue().catch(() => '[unserialisable]')),
      )
      errors.push('COMPONENT STACK >>> ' + JSON.stringify(extra, null, 2))
    } catch {
      /* ignore */
    }
  }
})
page.on('pageerror', (e) => errors.push(`PAGEERROR: ${e.message}\n${e.stack ?? ''}`))
page.on('requestfailed', (r) => errors.push(`REQFAIL: ${r.url()} ${r.failure()?.errorText}`))

await page.goto(URL, { waitUntil: 'networkidle2', timeout: 60000 })

// Wait past the preloader (2s) plus settle.
await new Promise((r) => setTimeout(r, 4500))

const report = await page.evaluate(() => {
  const canvas = document.querySelector('canvas')
  let gl = null
  if (canvas) {
    gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
  }
  return {
    title: document.title,
    rootChildren: document.getElementById('root')?.children.length ?? 0,
    hasCanvas: Boolean(canvas),
    canvasSize: canvas ? `${canvas.width}x${canvas.height}` : null,
    glLost: gl ? gl.isContextLost() : 'no-context',
    h1: document.querySelector('h1')?.innerText?.replace(/\s+/g, ' ').trim(),
    sections: [...document.querySelectorAll('section[id], footer[id]')].map((s) => s.id),
    preloaderPresent: Boolean(document.querySelector('[aria-hidden="true"].fixed.inset-0.z-\\[200\\]')),
    bodyOverflow: document.body.style.overflow || '(unset)',
    scrollHeight: document.documentElement.scrollHeight,
    textSample: document.body.innerText.replace(/\s+/g, ' ').slice(0, 260),
  }
})

console.log('--- PAGE REPORT ---')
console.log(JSON.stringify(report, null, 2))

await page.screenshot({ path: `${OUT}/01-hero.png` })

// Scroll through the page capturing each section.
const steps = [
  ['02-manifesto', '#hero'],
  ['03-about', '#about'],
  ['04-experience', '#experience'],
  ['05-work', '#work'],
  ['06-stack', '#stack'],
  ['07-contact', '#contact'],
]

for (const [name, sel] of steps) {
  await page.evaluate((s) => {
    document.querySelector(s)?.scrollIntoView({ behavior: 'instant', block: 'start' })
  }, sel)
  await new Promise((r) => setTimeout(r, 1600))
  await page.screenshot({ path: `${OUT}/${name}.png` })
}

// Hover a project card to exercise the tilt + spotlight path.
await page.evaluate(() => document.querySelector('#work')?.scrollIntoView({ block: 'start' }))
await new Promise((r) => setTimeout(r, 900))
const card = await page.$('#work .preserve-3d')
if (card) {
  const box = await card.boundingBox()
  if (box) {
    await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.4)
    await new Promise((r) => setTimeout(r, 900))
    await page.screenshot({ path: `${OUT}/08-card-hover.png` })
  }
}

// Mobile pass
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 })
await page.evaluate(() => window.scrollTo(0, 0))
await new Promise((r) => setTimeout(r, 1400))
await page.screenshot({ path: `${OUT}/09-mobile-hero.png` })
await page.evaluate(() => document.querySelector('#work')?.scrollIntoView({ block: 'start' }))
await new Promise((r) => setTimeout(r, 1400))
await page.screenshot({ path: `${OUT}/10-mobile-work.png` })

const mobileReport = await page.evaluate(() => ({
  horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1
    ? `OVERFLOW ${document.documentElement.scrollWidth} > ${window.innerWidth}`
    : 'none',
  scrollWidth: document.documentElement.scrollWidth,
  innerWidth: window.innerWidth,
}))

console.log('--- MOBILE ---')
console.log(JSON.stringify(mobileReport, null, 2))

console.log(`\n--- ERRORS (${errors.length}) ---`)
errors.slice(0, 25).forEach((e) => console.log('  ' + e))
console.log(`\n--- WARNINGS (${warnings.length}) ---`)
warnings.slice(0, 12).forEach((w) => console.log('  ' + w))
console.log(`\n--- LOGS (${logs.length}) ---`)
logs.slice(0, 12).forEach((l) => console.log('  ' + l))

await browser.close()
