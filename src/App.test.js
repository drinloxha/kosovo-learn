import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  const loginAs = async (email, password) => {
    await userEvent.type(screen.getByLabelText(/Email/i), email);
    await userEvent.type(screen.getByLabelText(/Fjalëkalimi/i), password);
    const buttons = screen.getAllByRole('button', { name: 'Hyr' });
    await userEvent.click(buttons[buttons.length - 1]);
  };

  test('shfaq panelin bazë të nxënësit pas hyrjes', async () => {
    render(<App />);

    await loginAs('nxenesi@example.com', 'sekreti123');

    expect(await screen.findByText('Kosovo Learn')).toBeInTheDocument();
    expect(
      await screen.findByRole('button', { name: /Ballina/ })
    ).toBeInTheDocument();
    expect(
      await screen.findByRole('button', { name: /Arta Kosova Klasa 5/ })
    ).toBeInTheDocument();
  });

  test('navigon te kuizet e klasës', async () => {
    render(<App />);

    await loginAs('nxenesi@example.com', 'sekreti123');

    const nav = await screen.findByRole('navigation');
    await userEvent.click(within(nav).getByRole('button', { name: /Kuizet/ }));

    expect(await screen.findByText('Kuizet e klasës')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Dorëzo përgjigjet/ })
    ).toBeInTheDocument();
  });

  test('stafi shton nxënës të ri nga paneli', async () => {
    render(<App />);

    await loginAs('admin@kosovolearn.com', 'admin123');

    // sigurohu që jemi në panelin e nxënësit për të parë listën
    const nav = await screen.findByRole('navigation');
    await userEvent.click(within(nav).getByRole('button', { name: /Ballina/ }));

    await userEvent.click(screen.getByRole('button', { name: '+ Nxënës i ri' }));
    await userEvent.type(screen.getByLabelText('Emri i plotë'), 'Arta Berisha');
    await userEvent.type(screen.getByLabelText(/^Email$/), 'arta@example.com');
    await userEvent.selectOptions(screen.getByLabelText('Klasa'), '7');
    await userEvent.type(screen.getByLabelText(/^Fjalëkalimi$/), 'sekret789');
    await userEvent.type(
      screen.getByLabelText('Konfirmo fjalëkalimin'),
      'sekret789'
    );
    await userEvent.click(screen.getByRole('button', { name: 'Krijo nxënësin' }));

    expect(
      screen.getByRole('button', { name: /Arta Berisha Klasa 7/ })
    ).toBeInTheDocument();
  });

  test('administratori kalon në panelin e stafit', async () => {
    render(<App />);

    await loginAs('admin@kosovolearn.com', 'admin123');

    await userEvent.click(await screen.findByRole('button', { name: 'Staf' }));

    expect(await screen.findByText('Përmbledhje e lëndëve')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Shto lëndë/ })).toBeInTheDocument();
  });
});
