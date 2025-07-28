import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { useNotification } from '@/contexts/NotificationContext';

import { post } from '@/utils/api/apiClients';
import { PUBLIC_API } from '@/utils/api/apiPaths';
import { LOGIN_PATH } from '@/utils/paths';
import { ResetPasswordRequest } from '@/utils/validators/reset-password-schema';

interface ResetPasswordApiResponse {
  message: string;
}

export const useResetPasswordMutation = () => {
  const { showNotification } = useNotification();
  const { push } = useRouter();

  return useMutation<ResetPasswordApiResponse, Error, ResetPasswordRequest>({
    mutationFn: async (data: ResetPasswordRequest) => {
      const response = await post<
        ResetPasswordApiResponse,
        ResetPasswordRequest
      >(PUBLIC_API.reset_password, data);
      return response;
    },
    onSuccess: (data) => {
      showNotification(data.message, 'success');
      push(LOGIN_PATH);
    },
    onError: (error) => {
      const apiErrorMessage = (error as any)?.response?.data?.message;
      if (apiErrorMessage) {
        showNotification(apiErrorMessage, 'error');
      }
    },
  });
};
