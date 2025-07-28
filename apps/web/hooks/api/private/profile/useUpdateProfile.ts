import { AuthResponse } from '@mindweave/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useNotification } from '@/contexts/NotificationContext';

import { patch } from '@/utils/api/apiClients';
import { PRIVATE_API } from '@/utils/api/apiPaths';
import { ProfileUpdateSchema } from '@/utils/validators/profile-update-schema';

interface UpdateProfileResponse {
  message: string;
  user: AuthResponse['user'];
}

export const useUpdateProfileMutation = () => {
  const { showNotification } = useNotification();
  const queryClient = useQueryClient();

  return useMutation<
    UpdateProfileResponse,
    Error,
    Partial<ProfileUpdateSchema>
  >({
    mutationFn: async (data: Partial<ProfileUpdateSchema>) => {
      const formData = new FormData();

      for (const key in data) {
        if (
          data.hasOwnProperty(key) &&
          key !== 'profileImage' &&
          key !== 'coverImage'
        ) {
          const value = data[key as keyof ProfileUpdateSchema];
          if (value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        }
      }

      if (data.profileImage instanceof File) {
        formData.append('profileImage', data.profileImage);
      }
      if (data.coverImage instanceof File) {
        formData.append('coverImage', data.coverImage);
      }

      const response = await patch<UpdateProfileResponse, FormData>(
        PRIVATE_API.update,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      return response;
    },
    onSuccess: (data) => {
      showNotification(
        data.message || 'Profile updated successfully!',
        'success',
      );
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      queryClient.setQueryData(['userProfile'], data.user);
    },
    onError: (error) => {
      const apiErrorMessage = (error as any)?.response?.data?.message;
      if (apiErrorMessage) {
        showNotification(apiErrorMessage, 'error');
      } else {
        showNotification('An error occurred during profile update.', 'error');
      }
    },
  });
};
