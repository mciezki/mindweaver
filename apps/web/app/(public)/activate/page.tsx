'use client';

import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  styled,
} from '@mui/material';
import Link from 'next/link';

import { useActivateAccount } from '@/hooks/api/public/useActivateAccount';

import { LOGIN_PATH } from '@/utils/paths';
import {
  ActivateAccountSchema,
  activateAccountSchema,
} from '@/utils/validators/activate-account-schema';

const ActivateAccountPage = () => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ActivateAccountSchema>({
    resolver: zodResolver(activateAccountSchema),
  });

  const { mutate: activate, isPending } = useActivateAccount();

  const onSubmit = (data: ActivateAccountSchema) => {
    activate(data);
  };

  return (
    <Box
      sx={{
        height: '100%',
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
          {t('activate_account.title')}
        </Typography>
        <Typography
          variant="body2"
          align="center"
          sx={{ color: 'text.secondary', mb: 2 }}
        >
          {t('activate_account.subtitle')}
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            {...register('token')}
            label={t('activate_account.form.token.label')}
            placeholder={t('activate_account.form.token.placeholder')}
            type="text"
            fullWidth
            margin="normal"
            error={!!errors.token}
            helperText={errors.token ? errors.token.message : ''}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ mt: 2, mb: 2 }}
            disabled={isPending || isSubmitting}
            startIcon={
              isPending || isSubmitting ? (
                <CircularProgress size={20} color="inherit" />
              ) : null
            }
          >
            {isPending || isSubmitting
              ? t('common.loading')
              : t('activate_account.form.button')}
          </Button>
        </form>

        <Typography
          variant="body2"
          align="center"
          sx={{ color: 'text.secondary', mt: 2 }}
        >
          {t('activate_account.have_account')}
          <Link href={LOGIN_PATH} passHref>
            <Button
              component="span"
              color="primary"
              sx={{ textTransform: 'none' }}
            >
              {t('activate_account.login_link')}
            </Button>
          </Link>
        </Typography>
      </FormContainer>
    </Box>
  );
};

export default ActivateAccountPage;

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
