import AxeBuilder from '@axe-core/playwright'
import { expect, revealAll, skipIntro, test } from './fixtures'

const ROUTES = ['/', '/santuario', '/arena', '/tribunal', '/linhas-temporais', '/arquivo-hira']

for (const path of ROUTES) {
  test(`axe: ${path} sem violações sérias ou críticas`, async ({ page }) => {
    await page.goto(path)
    if (path === '/') {
      await skipIntro(page)
      // O rodapé do Portal entra ~3s depois da abertura: medir contraste no meio do fade não faz sentido.
      await page.waitForTimeout(3500)
    }
    await revealAll(page)
    const { violations } = await new AxeBuilder({ page }).analyze()
    const blocking = violations
      .filter((v) => v.impact === 'serious' || v.impact === 'critical')
      .map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`)
    expect(blocking).toEqual([])
  })
}
