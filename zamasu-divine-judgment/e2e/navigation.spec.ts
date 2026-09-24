import { expect, skipIntro, test } from './fixtures'

const ROUTES = [
  { path: '/', heading: /Project Zamasu/ },
  { path: '/santuario', heading: /Zamasu/ },
  { path: '/arena', heading: /Arena Divina/ },
  { path: '/tribunal', heading: /Tribunal Divino/ },
  { path: '/linhas-temporais', heading: /Linhas Temporais/ },
  { path: '/arquivo-hira', heading: /Hira's Archive/ },
  { path: '/reino-que-nao-existe', heading: /Apagado/ },
]

for (const { path, heading } of ROUTES) {
  test(`deep link ${path} renderiza sem erros`, async ({ page, errors }) => {
    await page.goto(path)
    if (path === '/') await skipIntro(page)
    await expect(page.getByRole('heading', { level: 1, name: heading })).toBeAttached()
    await page.waitForTimeout(1200)
    expect(errors).toEqual([])
  })
}

test('não há rolagem horizontal em nenhum reino', async ({ page }) => {
  for (const { path } of ROUTES) {
    await page.goto(path)
    if (path === '/') await skipIntro(page)
    await page.waitForTimeout(800)
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    expect(overflow, `overflow em ${path}`).toBeLessThanOrEqual(0)
  }
})

test('menu dos reinos abre, fecha com Esc e navega', async ({ page, isMobile }) => {
  test.skip(isMobile, 'fluxo de teclado coberto no desktop')
  await page.goto('/santuario')
  const toggle = page.getByRole('button', { name: /Abrir menu/ })
  await toggle.click()
  const menu = page.locator('#realm-menu')
  await expect(menu).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(menu).toHaveCount(0)
  await toggle.click()
  await menu.getByRole('link', { name: /Tribunal Divino/ }).click()
  await expect(page).toHaveURL(/\/tribunal$/)
  await expect(menu).toHaveCount(0)
})
