'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

import { Box, TextField, Button, Typography, styled, Alert, CircularProgress } from '@mui/material';
import { forgotPasswordSchema, ForgotPasswordSchema } from '@/utils/validators/forgot-password-schema';
import { useForgotPasswordMutation } from '@/hooks/api/public/useForgotPassword';

const ForgotPasswordPage = () => {
    const { t } = useTranslation();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordSchema>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const { mutate: sendResetPasswordEmail, isPending, isError, error } = useForgotPasswordMutation();

    const onSubmit = (data: ForgotPasswordSchema) => {
        sendResetPasswordEmail(data)
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
                    {t('forgot_password.title')}
                </Typography>
                <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mb: 2 }}>
                    {t('forgot_password.subtitle')}
                </Typography>

                {isError && (
                    <Alert severity="error">
                        {t('forgot_password.error_message') || (error as any)?.response?.data?.message || t('common.error_message')}
                    </Alert>
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        {...register('email')}
                        label={t('forgot_password.form.email.label')}
                        placeholder={t('forgot_password.form.email.placeholder')}
                        type="email"
                        fullWidth
                        margin="normal"
                        error={!!errors.email}
                        helperText={errors.email ? t('forgot_password.form.email.invalid') : ''}
                    />
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
                        {isPending ? t('common.loading') : t('forgot_password.form.button')}
                    </Button>
                </form>

                <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mt: 2 }}>
                    <Link href="/login" passHref>
                        <Button component="span" color="primary" sx={{ textTransform: 'none' }}>
                            {t('forgot_password.back_to_login')}
                        </Button>
                    </Link>
                </Typography>
            </FormContainer>
        </Box>
    );
};

export default ForgotPasswordPage;

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