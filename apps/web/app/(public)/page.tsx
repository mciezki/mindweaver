'use client';

import React from 'react';
import { Box, Button, Typography, styled } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

import dashboardBg from '@/public/images/dashboardBg.png';
import { useTranslation } from 'react-i18next';

const LoggedOutDashboard = () => {
  const { t } = useTranslation();

  return (
    <DashboardContainer>
      <CardContainer>
        <ImageWrapper>
          <Image
            src={dashboardBg}
            alt="Scenic landscape background for dashboard"
            layout="fill"
            objectFit="cover"
            priority
          />
        </ImageWrapper>
        <ContentWrapper>
          <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
            {t('dashboard.title')}
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            {t('dashboard.description')}
          </Typography>
          <ButtonGroup>
            <Button
              component={Link}
              href="/login"
              variant="contained"
              color="primary"
              size="large"
            >
              {t('dashboard.login')}
            </Button>
            <Button
              component={Link}
              href="/register"
              variant="outlined"
              color="primary"
              size="large"
            >
              {t('dashboard.signup')}
            </Button>
          </ButtonGroup>
        </ContentWrapper>
      </CardContainer>
    </DashboardContainer>
  );
};

export default LoggedOutDashboard;

const DashboardContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(4),
}));

const CardContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  width: '100%',
  maxWidth: 800,
  overflow: 'hidden',
}));

const ImageWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: 300,
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 50%)',
    pointerEvents: 'none',
  },
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  color: theme.palette.text.primary,
}));

const ButtonGroup = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  display: 'flex',
  gap: theme.spacing(2),
}));