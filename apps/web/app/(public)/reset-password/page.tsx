'use client';

import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  styled,
} from '@mui/material';
import Link from 'next/link';

import { useResetPasswordMutation } from '@/hooks/api/public/useResetPassword';

import {
  ResetPasswordRequest,
  ResetPasswordSchema,
  resetPasswordSchema,
} from '@/utils/validators/reset-password-schema';

const ResetPasswordPage = () => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const {
    mutate: resetPassword,
    isPending,
    isError,
    error,
  } = useResetPasswordMutation();

  const onSubmit = (data: ResetPasswordSchema) => {
    const apiData: ResetPasswordRequest = {
      token: data.token,
      newPassword: data.newPassword,
    };

    resetPassword(apiData);
  };

  return (
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
          {t('reset_password.title')}
        </Typography>
        <Typography
          variant="body2"
          align="center"
          sx={{ color: 'text.secondary', mb: 2 }}
        >
          {t('reset_password.subtitle')}
        </Typography>

        {isError && (
          <Alert severity="error">
            {(isError && (error as any)?.response?.data?.message) ||
              t('reset_password.error_message')}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            {...register('token')}
            label={t('reset_password.form.token.label')}
            placeholder={t('reset_password.form.token.placeholder')}
            type="token"
            fullWidth
            margin="normal"
            error={!!errors.token}
            helperText={
              errors.token ? t('reset_password.form.token.required') : ''
            }
          />
          <TextField
            {...register('newPassword')}
            label={t('reset_password.form.password.label')}
            placeholder={t('reset_password.form.password.placeholder')}
            type="password"
            fullWidth
            margin="normal"
            error={!!errors.newPassword}
            helperText={
              errors.newPassword
                ? t('reset_password.form.confirm_password.required')
                : ''
            }
          />
          <TextField
            {...register('confirmPassword')}
            label={t('reset_password.form.confirm_password.label')}
            placeholder={t('reset_password.form.confirm_password.placeholder')}
            type="password"
            fullWidth
            margin="normal"
            error={!!errors.confirmPassword}
            helperText={
              errors.confirmPassword
                ? t('reset_password.form.confirm_password.required')
                : ''
            }
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ mt: 2, mb: 2 }}
            disabled={isPending}
            startIcon={
              isPending ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            {isPending ? t('common.loading') : t('reset_password.form.button')}
          </Button>
        </form>

        <Typography
          variant="body2"
          align="center"
          sx={{ color: 'text.secondary', mt: 2 }}
        >
          <Link href="/login" passHref>
            <Button
              component="span"
              color="primary"
              sx={{ textTransform: 'none' }}
            >
              {t('reset_password.go_to_login')}
            </Button>
          </Link>
        </Typography>
      </FormContainer>
    </Box>
  );
};

export default ResetPasswordPage;

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
