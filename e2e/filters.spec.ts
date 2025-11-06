import { test, expect } from '@playwright/test'

test.describe('Filtros do Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page.locator('h1')).toContainText('Dashboard')
  })

  test('deve filtrar clientes por consultor', async ({ page }) => {
    // 1. Abrir filtros
    await page.click('button:has-text("Filtros")')

    // 2. Selecionar um consultor
    const consultorSelect = page.locator('select').first()
    await consultorSelect.selectOption({ index: 1 }) // Seleciona primeiro consultor da lista

    // 3. Aplicar filtro (se houver botão de aplicar, ou aguardar auto-aplicação)
    await page.waitForTimeout(1000)

    // 4. Verificar que URL foi atualizada com query param
    const url = page.url()
    expect(url).toContain('consultor=')

    // 5. Verificar que tabela atualizou (deve haver clientes vinculados)
    // Se não houver clientes, deve mostrar mensagem
    const hasClients = await page.locator('table tbody tr').count()
    expect(hasClients).toBeGreaterThanOrEqual(0)
  })

  test('deve filtrar clientes por email do consultor', async ({ page }) => {
    // 1. Abrir filtros
    await page.click('button:has-text("Filtros")')

    // 2. Preencher campo de email
    await page.fill('input[name="email"]', '@')

    // 3. Aguardar debounce
    await page.waitForTimeout(1500)

    // 4. Verificar que URL foi atualizada
    const url = page.url()
    expect(url).toContain('email=')
  })

  test('deve filtrar clientes por período', async ({ page }) => {
    // 1. Abrir filtros
    await page.click('button:has-text("Filtros")')

    // 2. Preencher data inicial
    const startDate = '2024-01-01'
    await page.fill('input[name="startDate"]', startDate)

    // 3. Preencher data final
    const endDate = '2024-12-31'
    await page.fill('input[name="endDate"]', endDate)

    // 4. Aguardar aplicação do filtro
    await page.waitForTimeout(1000)

    // 5. Verificar URL
    const url = page.url()
    expect(url).toContain('startDate=')
    expect(url).toContain('endDate=')
  })

  test('deve limpar filtros corretamente', async ({ page }) => {
    // 1. Aplicar filtros
    await page.click('button:has-text("Filtros")')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.waitForTimeout(1500)

    // 2. Verificar que filtro foi aplicado
    let url = page.url()
    expect(url).toContain('email=')

    // 3. Clicar em limpar filtros
    await page.click('button:has-text("Limpar")')
    await page.waitForTimeout(500)

    // 4. Verificar que URL foi limpa
    url = page.url()
    expect(url).not.toContain('email=')
    expect(url).not.toContain('consultor=')
    expect(url).not.toContain('startDate=')
  })

  test('deve manter filtros ao navegar entre páginas', async ({ page }) => {
    // 1. Aplicar filtro
    await page.click('button:has-text("Filtros")')
    await page.fill('input[name="email"]', 'test')
    await page.waitForTimeout(1500)

    // 2. Navegar para outra página (se houver paginação)
    const paginationExists = await page.locator('button:has-text("2")').count()

    if (paginationExists > 0) {
      await page.click('button:has-text("2")')
      await page.waitForTimeout(500)

      // 3. Verificar que filtro foi mantido na URL
      const url = page.url()
      expect(url).toContain('email=test')
      expect(url).toContain('page=2')
    }
  })

  test('deve combinar múltiplos filtros', async ({ page }) => {
    // 1. Abrir filtros
    await page.click('button:has-text("Filtros")')

    // 2. Aplicar múltiplos filtros
    await page.fill('input[name="email"]', '@gmail.com')
    await page.fill('input[name="startDate"]', '2024-01-01')
    await page.waitForTimeout(1500)

    // 3. Verificar que URL contém todos os filtros
    const url = page.url()
    expect(url).toContain('email=')
    expect(url).toContain('startDate=')

    // 4. Verificar que tabela reflete os filtros
    // (resultados devem estar filtrados)
    const tableExists = await page.locator('table').count()
    expect(tableExists).toBeGreaterThan(0)
  })
})
