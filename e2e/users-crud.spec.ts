import { test, expect } from '@playwright/test'

test.describe('Fluxo completo de CRUD de usuários', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar para o dashboard antes de cada teste
    await page.goto('/')
  })

  test('deve criar, editar e deletar um usuário cliente', async ({ page }) => {
    // 1. Navegar para dashboard
    await expect(page).toHaveURL(/\/dashboard/)
    await expect(page.locator('h1')).toContainText('Dashboard')

    // 2. Clicar em "Criar usuário"
    await page.click('text=Criar usuário')
    await expect(page).toHaveURL(/\/usuarios\/novo/)
    await expect(page.locator('h1')).toContainText('Criar usuário')

    // 3. Preencher formulário - Tipo de usuário
    await page.selectOption('select[name="userType"]', 'CLIENTE')

    // 4. Preencher dados pessoais
    const timestamp = Date.now()
    const testEmail = `teste.e2e.${timestamp}@example.com`
    const testCPF = `${timestamp}`.slice(0, 11).padStart(11, '0')

    await page.fill('input[name="name"]', 'João Silva E2E')
    await page.fill('input[name="email"]', testEmail)
    await page.fill('input[name="phone"]', '11999999999')
    await page.fill('input[name="cpf"]', testCPF)
    await page.fill('input[name="age"]', '30')

    // 5. Clicar na tab "Endereço"
    await page.click('button:has-text("Endereço")')

    // 6. Preencher endereço
    await page.fill('input[name="cep"]', '01310100')

    // Aguardar o campo de endereço ser preenchido automaticamente (ViaCEP)
    await page.waitForTimeout(2000)

    // Verificar se o endereço foi preenchido
    const addressValue = await page.inputValue('input[name="address"]')
    expect(addressValue).toBeTruthy()

    await page.fill('input[name="complement"]', 'Apto 101')
    await page.selectOption('select[name="state"]', 'SP')

    // 7. Submeter formulário
    await page.click('button[type="submit"]')

    // 8. Aguardar toast de sucesso e redirecionamento
    await page.waitForTimeout(1000)
    await expect(page).toHaveURL(/\/dashboard/)

    // 9. Verificar que usuário aparece na tabela
    await expect(page.locator('text=João Silva E2E')).toBeVisible()
    await expect(page.locator(`text=${testEmail}`)).toBeVisible()

    // 10. Clicar no usuário para editar
    await page.click(`tr:has-text("${testEmail}")`)
    await expect(page).toHaveURL(/\/usuarios\/.*\/editar/)
    await expect(page.locator('h1')).toContainText('Editar usuário')

    // 11. Editar nome
    await page.fill('input[name="name"]', 'João Silva E2E Editado')

    // 12. Abrir modal de confirmação para atualizar
    await page.click('button:has-text("Atualizar")')

    // 13. Verificar modal de confirmação
    await expect(page.locator('text=Confirmar atualização')).toBeVisible()

    // 14. Confirmar atualização
    await page.click('div[role="dialog"] button:has-text("Confirmar")')

    // 15. Aguardar redirecionamento
    await page.waitForTimeout(1000)
    await expect(page).toHaveURL(/\/dashboard/)

    // 16. Verificar que nome foi atualizado na tabela
    await expect(page.locator('text=João Silva E2E Editado')).toBeVisible()

    // 17. Navegar novamente para edição para deletar
    await page.click(`tr:has-text("${testEmail}")`)
    await expect(page).toHaveURL(/\/usuarios\/.*\/editar/)

    // 18. Clicar em deletar
    await page.click('button:has-text("Deletar"):not([disabled])')

    // 19. Verificar modal de confirmação de exclusão
    await expect(page.locator('text=Confirmar exclusão')).toBeVisible()
    await expect(page.locator('text=Esta ação não pode ser desfeita')).toBeVisible()

    // 20. Confirmar deleção
    await page.click('div[role="dialog"] button:has-text("Deletar")')

    // 21. Aguardar redirecionamento
    await page.waitForTimeout(1000)
    await expect(page).toHaveURL(/\/dashboard/)

    // 22. Verificar que usuário foi removido da tabela
    await expect(page.locator('text=João Silva E2E Editado')).not.toBeVisible()
  })

  test('deve criar um consultor e vinculá-lo a clientes', async ({ page }) => {
    // 1. Navegar para criar usuário
    await page.click('text=Criar usuário')
    await expect(page).toHaveURL(/\/usuarios\/novo/)

    // 2. Selecionar tipo CONSULTOR
    await page.selectOption('select[name="userType"]', 'CONSULTOR')

    // 3. Preencher dados do consultor
    const timestamp = Date.now()
    const testEmail = `consultor.e2e.${timestamp}@example.com`

    await page.fill('input[name="name"]', 'Maria Consultora E2E')
    await page.fill('input[name="email"]', testEmail)
    await page.fill('input[name="phone"]', '11988888888')

    // 4. Verificar que campo de clientes apareceu
    await expect(page.locator('label:has-text("Clientes")')).toBeVisible()

    // 5. Submeter formulário
    await page.click('button[type="submit"]')

    // 6. Aguardar redirecionamento
    await page.waitForTimeout(1000)

    // 7. Navegar para página de consultores
    await page.click('a:has-text("Consultores")')
    await expect(page).toHaveURL(/\/consultores/)

    // 8. Verificar que consultor aparece na tabela
    await expect(page.locator('text=Maria Consultora E2E')).toBeVisible()

    // 9. Deletar consultor criado
    await page.click(`tr:has-text("${testEmail}")`)
    await page.click('button:has-text("Deletar"):not([disabled])')
    await page.click('div[role="dialog"] button:has-text("Deletar")')
    await page.waitForTimeout(1000)
  })

  test('deve validar campos obrigatórios', async ({ page }) => {
    // 1. Navegar para criar usuário
    await page.click('text=Criar usuário')

    // 2. Tentar submeter sem preencher nada
    await page.click('button[type="submit"]')

    // 3. Verificar que não navegou (ainda está na mesma página)
    await expect(page).toHaveURL(/\/usuarios\/novo/)

    // 4. Verificar mensagens de validação aparecem
    // HTML5 validation ou mensagens de erro do form
    const nameInput = page.locator('input[name="name"]')
    await expect(nameInput).toHaveAttribute('required', '')
  })

  test('deve buscar endereço por CEP', async ({ page }) => {
    // 1. Navegar para criar usuário
    await page.click('text=Criar usuário')

    // 2. Preencher dados mínimos
    await page.selectOption('select[name="userType"]', 'CLIENTE')
    await page.fill('input[name="name"]', 'Teste CEP')
    await page.fill('input[name="email"]', `cep.${Date.now()}@test.com`)

    // 3. Ir para tab de endereço
    await page.click('button:has-text("Endereço")')

    // 4. Preencher CEP válido
    await page.fill('input[name="cep"]', '01310100')
    await page.locator('input[name="cep"]').blur()

    // 5. Aguardar requisição ao ViaCEP
    await page.waitForTimeout(2000)

    // 6. Verificar que endereço foi preenchido
    const address = await page.inputValue('input[name="address"]')
    expect(address).toContain('Avenida Paulista')

    const state = await page.inputValue('select[name="state"]')
    expect(state).toBe('SP')
  })
})
