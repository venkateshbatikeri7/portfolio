import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

const URL = process.env.TARGET_URL || 'http://localhost:5199/'
mkdirSync('shots', { recursive: true })
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--enable-unsafe-swiftshader'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })

const errors = []
page.on('pageerror', (e) => errors.push(String(e)))
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(m.text())
})

await page.goto(URL, { waitUntil: 'networkidle0' })
await new Promise((r) => setTimeout(r, 2600))

const probe = () =>
  page.evaluate(() => {
    const html = document.documentElement
    const body = getComputedStyle(document.body)
    const h2 = document.querySelector('#work h2, h2')
    return {
      dataTheme: html.dataset.theme ?? '(none = dark)',
      bodyBg: body.backgroundColor,
      bodyColor: body.color,
      headingColor: h2 ? getComputedStyle(h2).color : null,
      colorScheme: getComputedStyle(html).colorScheme,
      stored: localStorage.getItem('portfolio-theme'),
      toggle: document.querySelector('[aria-label^="Switch to"]')?.getAttribute('aria-label') ?? 'MISSING',
      metaThemeColor: document.querySelector('meta[name="theme-color"]')?.content,
    }
  })

console.log('default      ', JSON.stringify(await probe(), null, 0))

// Click the toggle
await page.click('[aria-label^="Switch to"]')
await new Promise((r) => setTimeout(r, 500))
console.log('after toggle ', JSON.stringify(await probe(), null, 0))

// Survives a reload (proves the boot script + persistence work)
await page.reload({ waitUntil: 'networkidle0' })
await new Promise((r) => setTimeout(r, 2400))
const afterReload = await probe()
console.log('after reload ', JSON.stringify(afterReload, null, 0))

await page.screenshot({ path: 'shots/11-light-mode.png' })

// Toggle back
await page.click('[aria-label^="Switch to"]')
await new Promise((r) => setTimeout(r, 400))
console.log('back to dark ', JSON.stringify(await probe(), null, 0))

// Resume link sanity: real href, PDF, and download attribute
const resume = await page.evaluate(() => {
  const a = [...document.querySelectorAll('a')].find((el) =>
    /resume|\.pdf/i.test(el.getAttribute('href') || ''),
  )
  if (!a) return { found: false }
  return {
    found: true,
    href: a.getAttribute('href'),
    download: a.getAttribute('download'),
    type: a.getAttribute('type'),
  }
})
console.log('resume link  ', JSON.stringify(resume))

// Fetch the href and confirm it is really a PDF
if (resume.found) {
  const res = await page.evaluate(async (href) => {
    const r = await fetch(href)
    const b = await r.blob()
    return { status: r.status, type: b.type, size: b.size }
  }, resume.href)
  console.log('resume fetch ', JSON.stringify(res))
}

console.log('errors       ', errors.length, errors.slice(0, 3))
await browser.close()
