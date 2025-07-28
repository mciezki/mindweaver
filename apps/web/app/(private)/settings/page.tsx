'use client';

import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';

import {
    Box, TextField, Button, Typography, styled, CircularProgress,
    FormControl, InputLabel, Select, MenuItem, Avatar,
} from '@mui/material';

import { profileUpdateSchema, ProfileUpdateSchema } from '@/utils/validators/profile-update-schema';
import { useUpdateProfileMutation } from '@/hooks/api/private/profile/useUpdateProfile';

const SettingsPage = () => {
    const { t } = useTranslation();
    const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfileMutation();

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<ProfileUpdateSchema>({
        resolver: zodResolver(profileUpdateSchema),
        mode: 'onBlur',
        defaultValues: {
            profileName: '',
            slug: '',
            description: '',
            name: '',
            surname: '',
            birthday: '',
            sex: 'm',
            password: '',
        }
    });

    const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
    const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
    const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
    const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'profileImage' | 'coverImage') => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                if (field === 'profileImage') {
                    setProfileImageFile(file);
                    setProfileImagePreview(reader.result as string);
                } else {
                    setCoverImageFile(file);
                    setCoverImagePreview(reader.result as string);
                }
            };
            reader.readAsDataURL(file);
        } else {
            if (field === 'profileImage') {
                setProfileImageFile(null);
                setProfileImagePreview(null);
            } else {
                setCoverImageFile(null);
                setCoverImagePreview(null);
            }
        }
    };

    const onSubmit = (data: ProfileUpdateSchema) => {
        const apiData: Partial<ProfileUpdateSchema> = {};

        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const value = data[key as keyof ProfileUpdateSchema];

                if (value !== '' && value !== null && value !== undefined && typeof value !== 'object') {
                    (apiData as any)[key] = value;
                }
            }
        }

        if (profileImageFile) {
            (apiData as any).profileImage = profileImageFile;
        }
        if (coverImageFile) {
            (apiData as any).coverImage = coverImageFile;
        }

        updateProfile(apiData);
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
                <Typography variant="h4" align="center" gutterBottom sx={{ color: 'primary.main', fontWeight: 600 }}>
                    {t('profile.title')}
                </Typography>
                <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mb: 2 }}>
                    {t('profile.subtitle')}
                </Typography>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        {...register('profileName')}
                        label={t('profile.form.profileName.label')}
                        placeholder={t('profile.form.profileName.placeholder')}
                        type="text"
                        fullWidth
                        margin="normal"
                        error={!!errors.profileName}
                        helperText={errors.profileName ? t('profile.form.profileName.error') : ''}
                    />
                    <TextField
                        {...register('slug')}
                        label={t('profile.form.slug.label')}
                        placeholder={t('profile.form.slug.placeholder')}
                        type="text"
                        fullWidth
                        margin="normal"
                        error={!!errors.slug}
                        helperText={errors.slug ? t('profile.form.slug.error') : ''}
                    />
                    <TextField
                        {...register('description')}
                        label={t('profile.form.description.label')}
                        placeholder={t('profile.form.description.placeholder')}
                        type="text"
                        multiline
                        rows={4}
                        fullWidth
                        margin="normal"
                        error={!!errors.description}
                        helperText={errors.description ? t('profile.form.description.error') : ''}
                    />

                    <TextField
                        {...register('name')}
                        label={t('profile.form.name.label')}
                        placeholder={t('profile.form.name.placeholder')}
                        type="text"
                        fullWidth
                        margin="normal"
                        error={!!errors.name}
                        helperText={errors.name ? t('profile.form.name.error') : ''}
                    />
                    <TextField
                        {...register('surname')}
                        label={t('profile.form.surname.label')}
                        placeholder={t('profile.form.surname.placeholder')}
                        type="text"
                        fullWidth
                        margin="normal"
                        error={!!errors.surname}
                        helperText={errors.surname ? t('profile.form.surname.error') : ''}
                    />
                    <TextField
                        {...register('birthday')}
                        label={t('profile.form.birthday.label')}
                        placeholder={t('profile.form.birthday.placeholder')}
                        type="date"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.birthday}
                        helperText={errors.birthday ? t('profile.form.birthday.error') : ''}
                    />
                    <FormControl fullWidth margin="normal" error={!!errors.sex}>
                        <InputLabel id="sex-label">{t('profile.form.sex.label')}</InputLabel>
                        <Controller
                            name="sex"
                            control={control}
                            defaultValue="m"
                            render={({ field }) => (
                                <Select
                                    labelId="sex-label"
                                    id="sex"
                                    label={t('profile.form.sex.label')}
                                    {...field}
                                    value={field.value || ''}
                                >
                                    <MenuItem value="m">{t('profile.form.sex.male')}</MenuItem>
                                    <MenuItem value="f">{t('profile.form.sex.female')}</MenuItem>
                                </Select>
                            )}
                        />
                        {errors.sex && (
                            <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
                                {t('profile.form.sex.invalid')}
                            </Typography>
                        )}
                    </FormControl>

                    {/* Pola do przesyłania plików */}
                    <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                        {/* Brak userProfile, więc preview będzie tylko dla nowo wybranych plików */}
                        <Avatar src={profileImagePreview || undefined} sx={{ width: 80, height: 80 }} variant="rounded" />
                        <Button
                            variant="outlined"
                            component="label"
                            sx={{ flexGrow: 1 }}
                        >
                            {t('profile.form.profileImage.label')}
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, 'profileImage')}
                            />
                        </Button>
                        {profileImageFile && (
                            <Button onClick={() => handleFileChange({ target: { files: null } } as React.ChangeEvent<HTMLInputElement>, 'profileImage')}>
                                {t('common.remove')}
                            </Button>
                        )}
                    </Box>
                    <Box sx={{ mt: 2, mb: 2, position: 'relative', height: 150, overflow: 'hidden', borderRadius: 1 }}>
                        {/* Brak userProfile, więc preview będzie tylko dla nowo wybranych plików */}
                        {coverImagePreview && (
                            <img
                                src={coverImagePreview}
                                alt="Cover Preview"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        )}
                        <Button
                            variant="outlined"
                            component="label"
                            sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1 }}
                        >
                            {t('profile.form.coverImage.label')}
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, 'coverImage')}
                            />
                        </Button>
                        {coverImageFile && (
                            <Button onClick={() => handleFileChange({ target: { files: null } } as React.ChangeEvent<HTMLInputElement>, 'coverImage')}
                                sx={{ position: 'absolute', top: 8, right: 8, zIndex: 2, color: 'white', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                                {t('common.remove')}
                            </Button>
                        )}
                    </Box>

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        size="large"
                        sx={{ mt: 2, mb: 2 }}
                        disabled={isUpdating}
                        startIcon={isUpdating ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                        {isUpdating ? t('common.loading') : t('profile.form.button')}
                    </Button>
                </form>
            </FormContainer>
        </Box>
    );
};

export default SettingsPage;

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