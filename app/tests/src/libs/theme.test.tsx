import { render } from '@testing-library/react';
import { ListItemText, ThemeProvider } from '@mui/material';
import { darkTheme as theme } from '@/libs/theme';

describe('Theme libs', () => {
  it('MuiListItemText styleOverrides match', () => {
    const wrapper = ({ children }: { children: React.ReactElement }) => (
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    );
    const { container } = render(<ListItemText color="primary">123123</ListItemText>, { wrapper });
    const item = container.getElementsByClassName('MuiListItemText-root')[0];
    expect(item).toHaveStyle('font-weight: 500')
    expect(item).toHaveStyle('font-size: 0.87rem')
  });
});
