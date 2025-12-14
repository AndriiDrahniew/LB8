import { useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { useAuthStore } from '@/store/auth';

type LoginData = {
  email: string;
  password: string;
};

type LoginResponse = {
  message: string;
  data: string;
};

const loginRequest = async (data: LoginData): Promise<LoginResponse> => {
  const res = await apiClient.post('/auth/login', data);
  return res.data;
};

export const useLogin = () => {
  const setToken = useAuthStore((s) => s.setToken);

  return useMutation({
    mutationFn: loginRequest,
    onSuccess: (res) => {
      console.log('✅ RAW TOKEN FROM SERVER:', res.data);

      const clearToken = res.data.replace('Bearer ', '');

      setToken(clearToken);
      console.log('✅ TOKEN SAVED TO ZUSTAND:', clearToken);
    },
  });
};
