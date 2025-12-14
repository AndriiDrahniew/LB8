import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/axios';

export type TradeReport = {
  id: number;
  actionType: string;
  cost: number;
  name: string;
  surname: string;
  horseId: number;
};


const getTradeReports = async (): Promise<TradeReport[]> => {
  const res = await apiClient.get('/trade-reports');
  return res.data;
};

const getTradeReportById = async (id: number): Promise<TradeReport> => {
  const res = await apiClient.get(`/trade-reports/${id}`);
  return res.data;
};

const createTradeReport = async (data: Partial<TradeReport>): Promise<TradeReport> => {
  const res = await apiClient.post('/trade-reports', data);
  return res.data;
};

const updateTradeReport = async ({ id, data }: { id: number; data: Partial<TradeReport> }) => {
  const res = await apiClient.patch(`/trade-reports/${id}`, data);
  return res.data;
};

const deleteTradeReport = async (id: number) => {
  await apiClient.delete(`/trade-reports/${id}`);
};

// ===== React Query хуки =====

export const useTradeReports = () =>
  useQuery({
    queryKey: ['trade-reports'],
    queryFn: getTradeReports,
  });

export const useTradeReport = (id: number) =>
  useQuery({
    queryKey: ['trade-reports', id],
    queryFn: () => getTradeReportById(id),
    enabled: !!id,
  });

export const useCreateTradeReport = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createTradeReport,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['trade-reports'] }),
  });
};

export const useUpdateTradeReport = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateTradeReport,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['trade-reports'] }),
  });
};

export const useDeleteTradeReport = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteTradeReport,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['trade-reports'] }),
  });
};