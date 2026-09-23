import { test as base, expect, type Page } from '@playwright/test'

/**
 * Página que registra erros de runtime. Falhas de rede em recursos externos
 * (Google Fonts) não contam: dependem do ambiente, não do app.
 */
export const test = base.extend<{ errors: string[] }>({
  errors: async ({ page }, run) => {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))
    page.on('console', (m) => {
      if (m.type() === 'error' && !m.text().startsWith('Failed to load resource')) errors.push(m.text())
    })
    await run(errors)
  },
})

export { expect }

export async function skipIntro(page: Page) {
  await page.getByRole('button', { name: /Pular abertura/ }).click()
}

/** Percorre a página para disparar as revelações `whileInView`. */
export async function revealAll(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 100))
    }
  })
  await page.waitForTimeout(1500)
}
