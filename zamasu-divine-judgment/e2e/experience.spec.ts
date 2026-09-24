import { expect, skipIntro, test } from './fixtures'

test.describe('abertura', () => {
  test('roda sozinha até revelar os botões', async ({ page }) => {
    await page.goto('/')
    const cta = page.getByRole('link', { name: /Entrar no Santuário/ })
    // Os botões existem desde o início, mas só ficam opacos no fim da coreografia (~10s).
    await expect
      .poll(() => cta.evaluate((el) => getComputedStyle(el.parentElement!).opacity), { timeout: 15_000 })
      .toBe('1')
    await expect(page.getByRole('button', { name: /Pular abertura/ })).toHaveCount(0)
  })

  test('pode ser pulada, não repete na sessão e pode ser revista', async ({ page }) => {
    await page.goto('/')
    await skipIntro(page)
    await page.reload()
    await expect(page.getByRole('button', { name: /Pular abertura/ })).toHaveCount(0)
    await page.getByRole('button', { name: /Rever abertura/ }).click()
    await expect(page.getByRole('button', { name: /Pular abertura/ })).toBeVisible()
  })

  test('CTA leva ao santuário', async ({ page }) => {
    await page.goto('/')
    await skipIntro(page)
    await page.getByRole('link', { name: /Entrar no Santuário/ }).click()
    await expect(page).toHaveURL(/\/santuario$/)
  })
})

test.describe('sistema de formas', () => {
  for (const [label, id] of [
    ['Forma Corrompida', 'corrupted'],
    ['Forma Infinita', 'infinite'],
  ] as const) {
    test(`${label} altera a atmosfera e persiste após reload`, async ({ page, errors }) => {
      await page.goto('/santuario')
      await page.getByRole('radio', { name: label }).first().click()
      await expect(page.locator('html')).toHaveAttribute('data-form', id)
      await page.reload()
      await expect(page.locator('html')).toHaveAttribute('data-form', id)
      await expect(page.getByRole('radio', { name: label }).first()).toHaveAttribute('aria-checked', 'true')
      expect(errors).toEqual([])
    })
  }
})

test.describe('códex de poderes', () => {
  test('setas navegam entre poderes com foco e dão a volta', async ({ page, isMobile }) => {
    test.skip(isMobile, 'navegação por teclado é desktop')
    await page.goto('/santuario')
    const blade = page.getByRole('tab', { name: /Lâmina de Luz Divina/ })
    await blade.scrollIntoViewIfNeeded()
    await blade.focus()
    await page.keyboard.press('ArrowDown')
    await expect(page.getByRole('tab', { name: /Regeneração Imortal/ })).toHaveAttribute('aria-selected', 'true')
    await expect(page.getByRole('tab', { name: /Regeneração Imortal/ })).toBeFocused()
    await page.keyboard.press('ArrowUp')
    await page.keyboard.press('ArrowUp')
    await expect(page.getByRole('tab', { name: /Expansão da Corrupção/ })).toHaveAttribute('aria-selected', 'true')
  })

  test('cada poder pode ser invocado sem erros', async ({ page, errors }) => {
    await page.goto('/santuario')
    for (const [name, phrase] of [
      ['Lâmina de Luz Divina', /fio da justiça/],
      ['Regeneração Imortal', /se refaz/],
      ['Cólera Divina', /nunca mereceram/],
      ['Expansão da Corrupção', /me torno o mundo/],
    ] as const) {
      const tab = page.getByRole('tab', { name: new RegExp(name) })
      await tab.scrollIntoViewIfNeeded()
      await tab.click()
      await page.getByRole('button', { name: /Invocar/ }).click()
      await expect(page.getByText(phrase)).toBeVisible()
    }
    expect(errors).toEqual([])
  })
})

test('reduced motion: experiência funciona sem animações CSS', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' })
  const page = await context.newPage()
  await page.goto('/')
  await skipIntro(page)
  await expect(page.getByRole('link', { name: /Entrar no Santuário/ })).toBeVisible()
  const duration = await page.evaluate(() => {
    const el = document.querySelector('[style*="breathe"]')
    return el ? parseFloat(getComputedStyle(el).animationDuration) : 0
  })
  expect(duration).toBeLessThan(0.01)
  await context.close()
})
