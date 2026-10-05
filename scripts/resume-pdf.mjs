/**
 * Renders the resume HTML files to PDF with headless Chrome.
 *
 * Usage: node scripts/resume-pdf.mjs
 */
import puppeteer from 'puppeteer-core'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, resolve } from 'node:path'
import { statSync } from 'node:fs'

const CHROME = process.env.CHROME_PATH ?? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(HERE, '..', '..')

const TARGETS = [
  { src: 'Venkatesh_BS_ATS_Resume.html', out: 'Venkatesh_BS_ATS_Resume.pdf' },
  { src: 'Venkatesh_BS_MERN.html', out: 'Venkatesh_BS_MERN.pdf' },
  // The portfolio's download button bundles this copy.
  { src: 'Venkatesh_BS_MERN.html', out: resolve(ROOT, 'portfolio/src/assets/Venkatesh_BS_Resume.pdf') },
]

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'shell',
  args: ['--no-sandbox', '--disable-gpu'],
})

for (const { src, out } of TARGETS) {
  const srcPath = resolve(ROOT, src)
  const outPath = resolve(ROOT, out)

  const page = await browser.newPage()
  await page.goto(pathToFileURL(srcPath).href, { waitUntil: 'networkidle0', timeout: 60000 })
  await page.emulateMediaType('print')
  await page.evaluateHandle('document.fonts.ready')

  await page.pdf({
    path: outPath,
    format: 'letter',
    printBackground: true,
    preferCSSPageSize: true,
  })

  await page.close()
  console.log(`${src} -> ${out} (${(statSync(outPath).size / 1024).toFixed(1)} kB)`)
}

await browser.close()