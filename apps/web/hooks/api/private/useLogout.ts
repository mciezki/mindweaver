import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { useNotification } from '@/contexts/NotificationContext';

import { post } from '@/utils/api/apiClients';
import { PUBLIC_API } from '@/utils/api/apiPaths';
import { PUBLIC_DASHBOARD_PATH } from '@/utils/paths';

export const useLogoutMutation = () => {
  const { showNotification } = useNotification();
  const { push } = useRouter();

  return useMutation({
    mutationFn: async () => {
      const response = await post(PUBLIC_API.logout);
      return response;
    },
    onSuccess: (data) => {
      showNotification((data as any)?.message || '', 'success');
      push(PUBLIC_DASHBOARD_PATH);
    },
    onError: (error) => {
      const apiErrorMessage = (error as any)?.response?.data?.message;
      if (apiErrorMessage) {
        showNotification(apiErrorMessage, 'error');
      }
    },
  });
};
