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
  '/privacidade',
  '/termos',
];

test.describe('CuidarJuntos preview routes', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('cuidarjuntos-language', 'pt');
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
});
