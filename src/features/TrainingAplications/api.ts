import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/axios';

export type TrainingAplication = {
  id: number;
  lockedTime: string;
  typeTraining: string;
  horseId: number;
  clientId: number;
  state: string;
  trainingTime: string;
  trainerPassport: number;
};

const getTrainingAplications = async (): Promise<TrainingAplication[]> => {
  const res = await apiClient.get('/training-aplications');
  return res.data;
};

const getTrainingAplicationById = async (id: number): Promise<TrainingAplication> => {
  const res = await apiClient.get(`/training-aplications/${id}`);
  return res.data;
};

const createTrainingAplication = async (data: Partial<TrainingAplication>): Promise<TrainingAplication> => {
  const res = await apiClient.post('/training-aplications', data);
  return res.data;
};

const updateTrainingAplication = async ({ id, data }: { id: number; data: Partial<TrainingAplication> }) => {
  const res = await apiClient.patch(`/training-aplications/${id}`, data);
  return res.data;
};

const deleteTrainingAplication = async (id: number) => {
  await apiClient.delete(`/training-aplications/${id}`);
};

//React Query хуки

export const useTrainingAplications = () =>
  useQuery({
    queryKey: ['training-aplications'],
    queryFn: getTrainingAplications,
  });

export const useTrainingAplication = (id: number) =>
  useQuery({
    queryKey: ['training-aplications', id],
    queryFn: () => getTrainingAplicationById(id),
    enabled: !!id,
  });

export const useCreateTrainingAplication = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createTrainingAplication,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['training-aplications'] }),
  });
};

export const useUpdateTrainingAplication = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateTrainingAplication,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['training-aplications'] }),
  });
};

export const useDeleteTrainingAplication = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteTrainingAplication,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['training-aplications'] }),
  });
};
