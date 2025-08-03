'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

import { Box, CircularProgress, Typography, styled } from '@mui/material';

import { useProfileQuery } from '@/hooks/api/private/profile/useProfileQuery';

import { SettingsForm } from './elements/SettingsForm';

export const SettingsContainer = () => {
  const { t } = useTranslation();

  const { data: profile, isLoading } = useProfileQuery();

  if (isLoading)
    return (
      <>
        <CircularProgress />
      </>
    );

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'background.default',
          padding: 4,
        }}
      >
        <FormContainer>
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ color: 'primary.main', fontWeight: 600 }}
          >
            {t('profile.title')}
          </Typography>
          <Typography
            variant="body2"
            align="center"
            sx={{ color: 'text.secondary', mb: 2 }}
          >
            {t('profile.subtitle')}
          </Typography>

          <SettingsForm profile={profile} />
        </FormContainer>
      </Box>
    </>
  );
};

const FormContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  width: '100%',
  maxWidth: 400,
}));
