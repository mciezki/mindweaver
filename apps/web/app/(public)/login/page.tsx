'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

import { Box, TextField, Button, Typography, styled, Alert, CircularProgress } from '@mui/material';
import { loginSchema, LoginSchema } from '@/utils/validators/login-schema';
import { useLoginMutation } from '@/hooks/api/public/useLogin';
import { FORGOT_PASSWORD_PATH } from '@/utils/paths';

const LoginPage = () => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate: login, isPending } = useLoginMutation();

  const onSubmit = (data: LoginSchema) => {
    login(data)
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'background.default',
        padding: 4,
      }}
    >
      <FormContainer>
        <Typography variant="h4" align="center" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
          {t('login.title')}
        </Typography>
        <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mb: 2 }}>
          {t('login.subtitle')}
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            {...register('email')}
            label={t('login.form.email.label')}
            placeholder={t('login.form.email.placeholder')}
            type="email"
            fullWidth
            margin="normal"
            error={!!errors.email}
            helperText={errors.email ? t('login.form.email.required') : ''}
          />
          <TextField
            {...register('password')}
            label={t('login.form.password.label')}
            placeholder={t('login.form.password.placeholder')}
            type="password"
            fullWidth
            margin="normal"
            error={!!errors.password}
            helperText={errors.password ? t('login.form.password.required') : ''}
          />
          <Button
            component={Link}
            href={FORGOT_PASSWORD_PATH}
            sx={{ textTransform: 'none', mt: 1, mb: 2, alignSelf: 'flex-end' }}
            color="primary"
          >
            {t('login.form.forgot_password')}
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ mt: 2, mb: 2 }}
            disabled={isPending}
            startIcon={isPending ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isPending ? t('common.loading') : t('login.form.button')}
          </Button>
        </form>

        <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mt: 2 }}>
          {t('login.no_account')}
          <Link href="/sign-up" passHref>
            <Button component="span" color="primary" sx={{ textTransform: 'none' }}>
              {t('login.sign_up_link')}
            </Button>
          </Link>
        </Typography>
      </FormContainer>
    </Box>
  );
};

export default LoginPage;


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