'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

import {
  Box, TextField, Button, Typography, styled, CircularProgress,
  FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';

import { registerApiSchema, registerSchema, RegisterSchema } from '@/utils/validators/register-schema';
import { useRegisterMutation } from '@/hooks/api/public/useRegister';
import { RegisterRequest } from '@mindweave/types';

const RegisterPage = () => {
  const { t } = useTranslation();

  const { mutate: signUpUser, isPending } = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });


  const onSubmit = (data: RegisterSchema) => {
    const apiData: RegisterRequest = registerApiSchema.parse(data);

    signUpUser(apiData)
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
          {t('register.title')}
        </Typography>
        <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mb: 2 }}>
          {t('register.subtitle')}
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            {...register('email')}
            label={t('register.form.email.label')}
            placeholder={t('register.form.email.placeholder')}
            type="email"
            fullWidth
            margin="normal"
            error={!!errors.email}
            helperText={errors.email ? t('register.form.email.required') : ''}
          />
          <TextField
            {...register('password')}
            label={t('register.form.password.label')}
            placeholder={t('register.form.password.placeholder')}
            type="password"
            fullWidth
            margin="normal"
            error={!!errors.password}
            helperText={errors.password ? t('register.form.password.required') : ''}
          />
          <TextField
            {...register('confirmPassword')}
            label={t('register.form.confirm_password.label')}
            placeholder={t('register.form.confirm_password.placeholder')}
            type="password"
            fullWidth
            margin="normal"
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword ? t('register.form.confirm_password.required') : ''}
          />
          <TextField
            {...register('name')}
            label={t('register.form.name.label')}
            placeholder={t('register.form.name.placeholder')}
            type="text"
            fullWidth
            margin="normal"
            error={!!errors.name}
            helperText={errors.name ? t('register.form.name.required') : ''}
          />
          <TextField
            {...register('surname')}
            label={t('register.form.surname.label')}
            placeholder={t('register.form.surname.placeholder')}
            type="text"
            fullWidth
            margin="normal"
            error={!!errors.surname}
            helperText={errors.surname ? t('register.form.surname.required') : ''}
          />
          <TextField
            {...register('birthday')}
            label={t('register.form.birthday.label')}
            placeholder={t('register.form.birthday.placeholder')}
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            error={!!errors.birthday}
            helperText={errors.birthday ? t('register.form.birthday.required') : ''}
          />
          <FormControl fullWidth margin="normal" error={!!errors.sex}>
            <InputLabel id="sex-label">{t('register.form.sex.label')}</InputLabel>
            <Controller
              name="sex"
              control={control}
              defaultValue="m"
              render={({ field }) => (
                <Select
                  labelId="sex-label"
                  id="sex"
                  label={t('register.form.sex.label')}
                  {...field}
                  value={field.value || ''}
                >
                  <MenuItem value="m">{t('register.form.sex.male')}</MenuItem>
                  <MenuItem value="f">{t('register.form.sex.female')}</MenuItem>
                </Select>
              )}
            />
            {errors.sex && (
              <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
                {t('register.form.sex.invalid')}
              </Typography>
            )}
          </FormControl>

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
            {isPending ? t('common.loading') : t('register.form.button')}
          </Button>
        </form>

        <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mt: 2 }}>
          {t('register.already_have_account')} {' '}
          <Link href="/login" passHref>
            <Button component="span" color="primary" sx={{ textTransform: 'none' }}>
              {t('register.login_link')}
            </Button>
          </Link>
        </Typography>
      </FormContainer>
    </Box>
  );
};

export default RegisterPage;

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