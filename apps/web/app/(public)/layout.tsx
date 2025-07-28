'use client';

import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import {
  AppBar,
  Box,
  Button,
  Toolbar,
  Typography,
  styled,
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { PUBLIC_DASHBOARD_PATH } from '@/utils/paths';

interface PublicLayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: PublicLayoutProps) => {
  const { t } = useTranslation();
  const { push } = useRouter();

  return (
    <Box sx={{ flexGrow: 1, padding: '16px' }}>
      <StyledAppBar position="sticky">
        <StyledToolbar>
          <LogoContainer onClick={() => push(PUBLIC_DASHBOARD_PATH)}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                color: 'text.primary',
                fontWeight: 700,
              }}
            >
              {t('app')}
            </Typography>
          </LogoContainer>

          <NavLinks>
            <Button
              component={Link}
              href="/sign-up"
              color="primary"
              variant="text"
              sx={{ fontWeight: 600 }}
            >
              {t('dashboard.signup')}
            </Button>
            <Button
              component={Link}
              href="/login"
              color="primary"
              variant="contained"
              sx={{ fontWeight: 600 }}
            >
              {t('dashboard.login')}
            </Button>
          </NavLinks>
        </StyledToolbar>
      </StyledAppBar>

      <Box component="main" sx={{ height: '100%' }}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  boxShadow: theme.shadows[1],
  position: 'sticky',
  top: 0,
  zIndex: theme.zIndex.appBar,
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  justifyContent: 'space-between',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '16px',
  alignItems: 'center',
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  cursor: 'pointer',
}));

const NavLinks = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    gap: theme.spacing(1),
  },
}));
