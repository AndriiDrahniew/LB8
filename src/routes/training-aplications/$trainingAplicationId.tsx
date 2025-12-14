import { createFileRoute, useParams } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';

import {
  useTrainingAplication,
  useUpdateTrainingAplication,
} from '@/features/TrainingAplications/api';

const trainingAplicationSchema = z.object({
  lockedTime: z.string().min(2, 'Замало інформації'),
  typeTraining: z.string().min(2, 'Замало інформації'),
  horseId: z.number().positive('ID коня повинно бути додатним'),
  clientId: z.number().positive('ID клієнта повинно бути додатним'),
  state: z.string().min(2, 'Замало інформації'),
  trainingTime: z.string().min(2, 'Замало інформації'),
  trainerPassport: z.number().int().positive('ID тренера повинно бути додатним'),
});

type TrainingAplicationFormData = z.infer<typeof trainingAplicationSchema>;

export const Route = createFileRoute('/training-aplications/$trainingAplicationId')({
  component: TrainingAplicationEditPage,
});

function TrainingAplicationEditPage() {
  const { trainingAplicationId } = useParams({
    from: '/training-aplications/$trainingAplicationId',
  });

  const { data: app, isLoading, isError } = useTrainingAplication(Number(trainingAplicationId));
  const updateMutation = useUpdateTrainingAplication();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TrainingAplicationFormData>({
    resolver: zodResolver(trainingAplicationSchema),
  });

  useEffect(() => {
    if (app) {
      reset({
        lockedTime: app.lockedTime,
        typeTraining: app.typeTraining,
        horseId: app.horseId,
        clientId: app.clientId,
        state: app.state,
        trainingTime: app.trainingTime,
        trainerPassport: app.trainerPassport,
      });
    }
  }, [app, reset]);

  const onSubmit = (data: TrainingAplicationFormData) => {
    updateMutation.mutate({
      id: Number(trainingAplicationId),
      data,
    });
  };

  if (isLoading) return <div>Завантаження...</div>;
  if (isError || !app) return <div>Звіт не знайдено</div>;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Редагування заявки #{app.id}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        <div>
          <label className="block font-medium">Бажаний час</label>
          <input
            {...register('lockedTime')}
            className="w-full p-2 border rounded"
          />
          {errors.lockedTime && (
            <p className="text-red-500 text-sm">{errors.lockedTime.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium">Тип тренування</label>
          <input
            {...register('typeTraining')}
            className="w-full p-2 border rounded"
          />
          {errors.typeTraining && (
            <p className="text-red-500 text-sm">{errors.typeTraining.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium">ID коня</label>
          <input
            type="number"
            {...register('horseId', { valueAsNumber: true })}
            className="w-full p-2 border rounded"
          />
          {errors.horseId && (
            <p className="text-red-500 text-sm">{errors.horseId.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium">ID клієнта</label>
          <input
            type="number"
            {...register('clientId', { valueAsNumber: true })}
            className="w-full p-2 border rounded"
          />
          {errors.clientId && (
            <p className="text-red-500 text-sm">{errors.clientId.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium">Стан заявки</label>
          <input
            {...register('state')}
            className="w-full p-2 border rounded"
          />
          {errors.state && (
            <p className="text-red-500 text-sm">{errors.state.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium">Точний час тренування</label>
          <input
            {...register('trainingTime')}
            className="w-full p-2 border rounded"
          />
          {errors.trainingTime && (
            <p className="text-red-500 text-sm">{errors.trainingTime.message}</p>
          )}
        </div>

        <div>
          <label className="block font-medium">ID тренера</label>
          <input
            type="number"
            {...register('trainerPassport', { valueAsNumber: true })}
            className="w-full p-2 border rounded"
          />
          {errors.trainerPassport && (
            <p className="text-red-500 text-sm">{errors.trainerPassport.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={updateMutation.isPending}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
        >
          {updateMutation.isPending ? 'Збереження...' : 'Зберегти'}
        </button>
      </form>
    </div>
  );
}
