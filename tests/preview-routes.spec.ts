import { expect, test } from '@playwright/test';

const dashboardRoutes = [
  '/dashboard',
  '/dashboard/guia',
  '/dashboard/mais',
  '/dashboard/perfil',
  '/dashboard/medicamentos',
  '/dashboard/consultas',
  '/dashboard/tarefas',
  '/dashboard/documentos',
  '/dashboard/emergencia',
  '/dashboard/familia',
  '/dashboard/notas',
  '/dashboard/definicoes',
];

const publicRoutes = [
  '/',
  '/como-funciona',
  '/entrar',
  '/criar-conta',
  '/recuperar-password',
  '/atualizar-password',
  '/aceitar-convite?token=invalid-preview-token',
  '/blog',
  '/guia',
  '/privacidade',
  '/termos',
  '/cookies',
  '/cancelamento',
  '/seguranca',
  '/contacto',
];

test.describe('CuidarJuntos preview routes', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('cuidarjuntos-language', 'pt');
      window.localStorage.setItem('cuidarjuntos-privacy-consent-v1', JSON.stringify({
        version: 1,
        choice: 'essential',
        metrics: false,
        decidedAt: new Date().toISOString(),
      }));
    });
  });

  for (const route of publicRoutes) {
    test(`${route} renders without horizontal overflow`, async ({ page }) => {
      await page.goto(route);
      await expect(page.locator('main')).toBeVisible();
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      expect(overflow).toBe(false);
    });
  }

  for (const route of dashboardRoutes) {
    test(`${route} has stable mobile layout and no blocking dialog`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(route);

      await expect(page.getByRole('dialog')).toHaveCount(0);

      const metrics = await page.evaluate(() => {
        const notificationButtons = [...document.querySelectorAll('button, a')].filter((el) => {
          const rect = el.getBoundingClientRect();
          const style = window.getComputedStyle(el);
          const visible = rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
          return visible && `${el.getAttribute('aria-label') || ''} ${el.textContent || ''}`.toLowerCase().includes('notification');
        });

        return {
          hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
          notificationButtons: notificationButtons.length,
        };
      });

      expect(metrics.hasHorizontalOverflow).toBe(false);
      expect(metrics.notificationButtons).toBeLessThanOrEqual(1);
    });
  }

  for (const viewport of [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'mobile', width: 390, height: 844 },
  ]) {
    test(`notification panel is readable and inside viewport on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/dashboard');

      const notificationButton = page.getByRole('button', { name: /notificações|notifications/i }).first();
      await expect(notificationButton).toBeVisible();
      await notificationButton.click();

      const panel = page.getByRole('menu', { name: /notificações|notifications/i });
      await expect(panel).toBeVisible();
      await expect(panel.getByText(/dose em falta|missed dose/i)).toBeVisible();

      const bounds = await panel.evaluate((element) => {
        const rect = element.getBoundingClientRect();
        return {
          left: rect.left,
          top: rect.top,
          right: rect.right,
          bottom: rect.bottom,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
        };
      });

      expect(bounds.left).toBeGreaterThanOrEqual(0);
      expect(bounds.top).toBeGreaterThanOrEqual(0);
      expect(bounds.right).toBeLessThanOrEqual(bounds.viewportWidth);
      expect(bounds.bottom).toBeLessThanOrEqual(bounds.viewportHeight);
    });
  }

  test('pricing uses new plan names, annual savings, and no sensor copy', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Famílias' })).toBeVisible();
    await expect(page.getByText('Integração com Sensores')).toHaveCount(0);
    await expect(page.getByText('Sensor integration')).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'Começar grátis' })).toBeVisible();
    await expect(page.getByText('Comece agora — grátis para sempre')).toHaveCount(0);

    await page.getByRole('button', { name: 'Anual' }).click();
    await expect(page.getByText('39€')).toBeVisible();
    await expect(page.getByText('79€')).toBeVisible();
    await expect(page.getByText(/Poupe mais de 4 meses/)).toBeVisible();
    await expect(page.getByText(/Poupe mais de 3 meses/)).toBeVisible();
  });

  test('english pricing uses Households naming and annual savings', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('cuidarjuntos-language', 'en');
    });
    await page.goto('/');
    await expect(page.getByText('Households')).toBeVisible();
    await expect(page.getByText('Sensor integration')).toHaveCount(0);

    await page.getByRole('button', { name: 'Yearly' }).click();
    await expect(page.getByText('€39')).toBeVisible();
    await expect(page.getByText('€79')).toBeVisible();
    await expect(page.getByText(/Save more than 4 months/)).toBeVisible();
    await expect(page.getByText(/Save more than 3 months/)).toBeVisible();
  });

  test('paid pricing CTA stores selected trial plan before signup is submitted', async ({ page }) => {
    await page.goto('/criar-conta?plan=households&billing=yearly');

    const pendingPlan = await page.evaluate(() => window.localStorage.getItem('cuidarjuntos-pending-plan'));
    expect(pendingPlan).toBe(JSON.stringify({ plan: 'households', billing: 'yearly' }));
  });

  test('dashboard shows one first-time setup surface, not duplicate setup cards', async ({ page }) => {
    await page.goto('/dashboard');

    await expect(page.getByText('Configuração inicial')).toHaveCount(0);
  });

  test('signup catches common email domain typos before auth request', async ({ page }) => {
    await page.goto('/criar-conta');
    await page.getByLabel('Nome').fill('Joao Guilherme');
    await page.getByLabel('Email').fill('joaoguilhermesilva02@gmail.cor');
    await page.getByLabel('Palavra-passe', { exact: true }).fill('password123');
    await page.getByLabel('Confirmar palavra-passe', { exact: true }).fill('password123');
    await page.getByRole('button', { name: 'Criar conta' }).click();

    await expect(page.getByText(/Verifique o domínio do email/)).toBeVisible();
    await expect(page.getByText(/Error sending confirmation email/)).toHaveCount(0);
  });

  test('mobile home exposes both sign in and create account actions', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    await expect(page.getByRole('link', { name: 'Entrar' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Criar conta' }).first()).toBeVisible();
  });

  test('demo dashboard exposes sign in and create account actions', async ({ page }) => {
    await page.goto('/dashboard');

    await expect(page.getByRole('link', { name: 'Entrar' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Criar conta' })).toBeVisible();
  });

  test('footer exposes production-ready support and legal links', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('contentinfo').getByRole('link', { name: 'Contacto' })).toBeVisible();
    await expect(page.getByRole('contentinfo').getByRole('link', { name: 'Segurança dos dados' })).toBeVisible();
    await expect(page.getByRole('contentinfo').getByRole('link', { name: 'Política de cookies' })).toBeVisible();
    await expect(page.getByRole('contentinfo').getByText('Dados protegidos')).toBeVisible();
    await expect(page.getByRole('contentinfo').getByText('Pagamentos seguros')).toBeVisible();
    await expect(page.getByRole('contentinfo').getByText('Cancele quando quiser')).toBeVisible();
    await expect(page.getByRole('contentinfo').getByText('Supabase')).toHaveCount(0);
    await expect(page.getByRole('contentinfo').getByText('Vercel')).toHaveCount(0);
    await expect(page.getByRole('contentinfo').getByText('Resend')).toHaveCount(0);
  });

  test('privacy banner stores consent and footer can reopen preferences', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.removeItem('cuidarjuntos-privacy-consent-v1');
    });
    await page.goto('/');

    await expect(page.getByText('Privacidade e métricas')).toBeVisible();
    await page.getByRole('button', { name: 'Apenas essenciais' }).click();
    await expect(page.getByText('Privacidade e métricas')).toHaveCount(0);

    const consent = await page.evaluate(() => window.localStorage.getItem('cuidarjuntos-privacy-consent-v1'));
    expect(consent).toContain('"metrics":false');

    await page.getByRole('button', { name: 'Preferências de privacidade' }).click();
    await expect(page.getByText('Privacidade e métricas')).toBeVisible();
  });

  test('footer quick guide opens the public guide, not the dashboard guide', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('contentinfo').getByRole('link', { name: 'Guia rápido' }).click();

    await expect(page).toHaveURL(/\/guia$/);
    await expect(page.getByRole('heading', { name: 'Guia rápido' })).toBeVisible();
    await expect(page).not.toHaveURL(/dashboard/);
  });

  test('dashboard billing cards show prices, trial timing and free plan inclusions', async ({ page }) => {
    await page.goto('/dashboard/definicoes?upgrade=1');

    await expect(page.getByText('Incluído no plano Grátis')).toBeVisible();
    await expect(page.getByText('Ficha de emergência básica')).toBeVisible();
    await expect(page.getByText('4,99€', { exact: true })).toBeVisible();
    await expect(page.getByText('8,99€', { exact: true })).toBeVisible();
    await expect(page.getByText(/Depois dos 14 dias: 4,99€\/mês/)).toBeVisible();

    await page.getByRole('button', { name: 'Anual' }).click();
    await expect(page.getByText('39€', { exact: true })).toBeVisible();
    await expect(page.getByText('79€', { exact: true })).toBeVisible();
    await expect(page.getByText(/Depois dos 14 dias: 39€\/ano/)).toBeVisible();
  });

  test('legal pages no longer show unfinished review notes', async ({ page }) => {
    for (const route of ['/privacidade', '/termos', '/cookies', '/cancelamento', '/seguranca', '/contacto']) {
      await page.goto(route);
      await expect(page.getByText(/profissional jurídico|legal professional/i)).toHaveCount(0);
    }
  });
});
