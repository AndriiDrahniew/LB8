import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/axios';

export type Horse = {
  id: number;
  weight: number;
  stallNumber: number;
  using: string;
  owner: string;
  age: number;
  height: number;
  breed: string;
  name: string;
  sex: string;
};

const getHorses = async (): Promise<Horse[]> => {
  const res = await apiClient.get('/horses');
  return res.data;
};

const getHorseById = async (id: number): Promise<Horse> => {
  const res = await apiClient.get(`/horses/${id}`);
  return res.data;
};

const createHorse = async (data: Partial<Horse>): Promise<Horse> => {
  const res = await apiClient.post('/horses', data);
  return res.data;
};

const updateHorse = async ({ id, data }: { id: number; data: Partial<Horse> }) => {
  const res = await apiClient.patch(`/horses/${id}`, data);
  return res.data;
};

const deleteHorse = async (id: number) => {
  await apiClient.delete(`/horses/${id}`);
};

// React Query хуки

export const useHorses = () =>
  useQuery({
    queryKey: ['horses'],
    queryFn: getHorses,
  });

export const useHorse = (id: number) =>
  useQuery({
    queryKey: ['horses', id],
    queryFn: () => getHorseById(id),
    enabled: !!id,
  });

export const useCreateHorse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createHorse,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['horses'] }),
  });
};

export const useUpdateHorse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateHorse,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['horses'] }),
  });
};

export const useDeleteHorse = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteHorse,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['horses'] }),
  });
};
