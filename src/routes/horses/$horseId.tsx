import { createFileRoute, useParams } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';

import { useHorse, useUpdateHorse } from '@/features/horses/api';

const horseSchema = z.object({
  name: z.string().min(2, 'Імʼя занадто коротке'),
  breed: z.string().min(2, 'Порода занадто коротка'),
  sex: z.string().min(1, 'Вкажіть стать'),
  owner: z.string().min(2, 'Власник занадто короткий'),
  using: z.string().min(2, 'Призначення занадто коротке'),

  age: z.number().int().positive('Вік має бути додатним'),
  weight: z.number().positive('Вага має бути додатною'),
  height: z.number().positive('Зріст має бути додатнім'),
  stallNumber: z.number().int().positive('Номер стійла має бути додатнім'),
});

type HorseFormData = z.infer<typeof horseSchema>;

export const Route = createFileRoute('/horses/$horseId')({
  component: HorseEditPage,
});

function HorseEditPage() {
  const { horseId } = useParams({
    from: '/horses/$horseId',
  });

  const { data: horse, isLoading, isError } = useHorse(Number(horseId));
  const updateMutation = useUpdateHorse();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<HorseFormData>({
    resolver: zodResolver(horseSchema),
  });

  useEffect(() => {
    if (horse) {
      reset({
        name: horse.name,
        breed: horse.breed,
        sex: horse.sex,
        owner: horse.owner,
        using: horse.using,
        age: horse.age,
        weight: horse.weight,
        height: horse.height,
        stallNumber: horse.stallNumber,
      });
    }
  }, [horse, reset]);

  const onSubmit = (data: HorseFormData) => {
    updateMutation.mutate({
      id: Number(horseId),
      data,
    });
  };

  if (isLoading) return <div>Завантаження...</div>;
  if (isError || !horse) return <div>Коня не знайдено</div>;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Редагування коня: {horse.name}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        <Input label="Імʼя" error={errors.name?.message}>
          <input {...register('name')} className="w-full p-2 border rounded" />
        </Input>

        <Input label="Порода" error={errors.breed?.message}>
          <input {...register('breed')} className="w-full p-2 border rounded" />
        </Input>

        <Input label="Стать" error={errors.sex?.message}>
          <input {...register('sex')} className="w-full p-2 border rounded" />
        </Input>

        <Input label="Власник" error={errors.owner?.message}>
          <input {...register('owner')} className="w-full p-2 border rounded" />
        </Input>

        <Input label="Призначення" error={errors.using?.message}>
          <input {...register('using')} className="w-full p-2 border rounded" />
        </Input>

        <Input label="Вік" error={errors.age?.message}>
          <input type="number" {...register('age', { valueAsNumber: true })} className="w-full p-2 border rounded" />
        </Input>

        <Input label="Вага" error={errors.weight?.message}>
          <input type="number" {...register('weight', { valueAsNumber: true })} className="w-full p-2 border rounded" />
        </Input>

        <Input label="Зріст" error={errors.height?.message}>
          <input type="number" {...register('height', { valueAsNumber: true })} className="w-full p-2 border rounded" />
        </Input>

        <Input label="Номер стійла" error={errors.stallNumber?.message}>
          <input type="number" {...register('stallNumber', { valueAsNumber: true })} className="w-full p-2 border rounded" />
        </Input>

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

function Input({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block font-medium">{label}</label>
      {children}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}