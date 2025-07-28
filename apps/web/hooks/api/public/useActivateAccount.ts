import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { useNotification } from '@/contexts/NotificationContext';

import { post } from '@/utils/api/apiClients';
import { PUBLIC_API } from '@/utils/api/apiPaths';
import { LOGIN_PATH } from '@/utils/paths';
import { ActivateAccountSchema } from '@/utils/validators/activate-account-schema';

interface ApiResponse {
  message: string;
}

export const useActivateAccount = () => {
  const { showNotification } = useNotification();
  const { push } = useRouter();
  return useMutation<ApiResponse, Error, ActivateAccountSchema>({
    mutationFn: async (data: ActivateAccountSchema) => {
      const response = await post<ApiResponse, ActivateAccountSchema>(
        PUBLIC_API.activate,
        data,
      );
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
