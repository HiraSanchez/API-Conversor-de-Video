import AxeBuilder from '@axe-core/playwright'
import type { Page } from '@playwright/test'
import { expect, test } from './fixtures'

/**
 * Responde o dilema atual pela tecla e avança (Enter no botão focado).
 * Espera o card ficar pronto (primeira opção focada), como um usuário que lê
 * a pergunta antes de responder; teclas durante a transição são ignoradas.
 */
async function answer(page: Page, key: string, last = false) {
  const card = page.locator('section[aria-labelledby^="dilemma-"]:not([inert])')
  await expect(card.getByRole('button').first()).toBeFocused()
  await page.keyboard.press(key)
  await expect(card.getByRole('button', { name: last ? /Ouvir o veredito/ : /Próximo dilema/ })).toBeFocused()
  await page.keyboard.press('Enter')
}

async function blockingViolations(page: Page) {
  const { violations } = await new AxeBuilder({ page }).analyze()
  return violations
    .filter((v) => v.impact === 'serious' || v.impact === 'critical')
    .map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`)
}

test('julgamento completo por teclado: veredito, perfil e memória na volta', async ({ page, errors, isMobile }) => {
  test.skip(isMobile, 'atalhos de teclado são desktop; o mobile é coberto pelo teste de toque')
  await page.goto('/tribunal')
  await page.getByRole('button', { name: /Aceitar o julgamento/ }).click()
  await expect(page.getByText('Dilema I de VII')).toBeVisible()

  // A (primeira opção) em todos: é a resposta que o Zamasu mais reconhece.
  for (let i = 0; i < 7; i++) await answer(page, '1', i === 6)

  await expect(page.getByRole('heading', { level: 2, name: 'Digno' })).toBeVisible()
  await expect(page.getByText(/Eixo dominante/)).toBeVisible()
  await expect(page.getByRole('button', { name: /Ser julgado novamente/ })).toBeVisible()

  // Memória: ao voltar, o Zamasu lembra do veredito anterior.
  await page.reload()
  await page.getByRole('button', { name: /Ser julgado novamente/ }).click()
  await expect(page.getByText(/Você voltou/)).toBeVisible()
  await expect(page.getByText('Digno')).toBeVisible()
  expect(errors).toEqual([])
})

test('toque: responder mostra a fala do Zamasu e a balança reage', async ({ page }) => {
  await page.goto('/tribunal')
  await page.getByRole('button', { name: /Aceitar o julgamento/ }).click()
  await expect(page.getByText(/A balança está em equilíbrio/)).toBeVisible()
  await page.getByRole('button', { name: /Confiar que eles vão aprender/ }).click()
  await expect(page.getByText(/A mesma palavra que os deuses usaram/)).toBeVisible()
  await expect(page.getByText(/A balança pende contra você/)).toBeVisible()
  // Depois de responder, as outras opções travam.
  await expect(page.getByRole('button', { name: /Destruí-la/ })).toBeDisabled()
})

test('recarregar no meio do julgamento retoma no mesmo dilema', async ({ page }) => {
  await page.goto('/tribunal')
  await page.getByRole('button', { name: /Aceitar o julgamento/ }).click()
  await page.getByRole('button', { name: /Destruí-la/ }).click()
  await page.getByRole('button', { name: /Próximo dilema/ }).click()
  await expect(page.getByText('Dilema II de VII')).toBeVisible()
  await page.reload()
  await expect(page.getByText('Dilema II de VII')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'O criador falho' })).toBeVisible()
})

test('abandonar volta à convocação sem registrar veredito', async ({ page }) => {
  await page.goto('/tribunal')
  await page.getByRole('button', { name: /Aceitar o julgamento/ }).click()
  await page.getByRole('button', { name: /Abandonar julgamento/ }).click()
  await expect(page.getByRole('button', { name: /Aceitar o julgamento/ })).toBeVisible()
  await expect(page.getByText(/Último veredito/)).toHaveCount(0)
})

test('axe: dilema e veredito sem violações sérias ou críticas', async ({ page, isMobile }) => {
  test.skip(isMobile, 'uma passada basta; o layout mobile é coberto pelo teste de overflow')
  await page.goto('/tribunal')
  await page.getByRole('button', { name: /Aceitar o julgamento/ }).click()
  await page.getByRole('button', { name: /Destruí-la/ }).click()
  await page.waitForTimeout(1200)
  expect(await blockingViolations(page)).toEqual([])

  await page.getByRole('button', { name: /Próximo dilema/ }).click()
  for (let i = 1; i < 7; i++) await answer(page, '3', i === 6)
  await expect(page.getByText('O Tribunal decidiu.')).toBeVisible()
  await page.waitForTimeout(4500) // revelação dramática termina
  expect(await blockingViolations(page)).toEqual([])
})
