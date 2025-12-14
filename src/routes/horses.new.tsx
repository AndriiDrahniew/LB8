import { createFileRoute } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateHorse } from '@/features/horses/api';

const horseSchema = z.object({
  name: z.string().min(2, 'Імʼя занадто коротке'),
  breed: z.string().min(2, 'Порода занадто коротка'),
  age: z.number().int().positive('Вік має бути додатнім'),
  weight: z.number().positive('Вага має бути додатньою'),
  height: z.number().positive('Зріст має бути додатнім'),
  sex: z.string().min(1, 'Вкажіть стать'),
  owner: z.string().min(2, 'Власник занадто короткий'),
  stallNumber: z.number().int().positive('Номер стійла має бути додатнім'),
  using: z.string().min(1, 'Поле використання не може бути пустим'),
});

type HorseFormData = z.infer<typeof horseSchema>;

export const Route = createFileRoute('/horses/new')({
  component: HorsesCreatePage,
});

function HorsesCreatePage() {
  const createHorse = useCreateHorse();
  const { register, handleSubmit, formState: { errors } } = useForm<HorseFormData>({
    resolver: zodResolver(horseSchema),
  });

  const onSubmit = (data: HorseFormData) => {
    createHorse.mutate(data);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Додати нового коня</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium">Імʼя</label>
          <input {...register('name')} className="w-full p-2 border rounded" />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block font-medium">Порода</label>
          <input {...register('breed')} className="w-full p-2 border rounded" />
          {errors.breed && <p className="text-red-500 text-sm">{errors.breed.message}</p>}
        </div>

        <div>
          <label className="block font-medium">Вік</label>
          <input type="number" {...register('age', { valueAsNumber: true })} className="w-full p-2 border rounded" />
          {errors.age && <p className="text-red-500 text-sm">{errors.age.message}</p>}
        </div>

        <div>
          <label className="block font-medium">Вага</label>
          <input type="number" {...register('weight', { valueAsNumber: true })} className="w-full p-2 border rounded" />
          {errors.weight && <p className="text-red-500 text-sm">{errors.weight.message}</p>}
        </div>

        <div>
          <label className="block font-medium">Зріст</label>
          <input type="number" {...register('height', { valueAsNumber: true })} className="w-full p-2 border rounded" />
          {errors.height && <p className="text-red-500 text-sm">{errors.height.message}</p>}
        </div>

        <div>
          <label className="block font-medium">Стать</label>
          <input {...register('sex')} className="w-full p-2 border rounded" />
          {errors.sex && <p className="text-red-500 text-sm">{errors.sex.message}</p>}
        </div>

        <div>
          <label className="block font-medium">Власник</label>
          <input {...register('owner')} className="w-full p-2 border rounded" />
          {errors.owner && <p className="text-red-500 text-sm">{errors.owner.message}</p>}
        </div>

        <div>
          <label className="block font-medium">Номер стійла</label>
          <input type="number" {...register('stallNumber', { valueAsNumber: true })} className="w-full p-2 border rounded" />
          {errors.stallNumber && <p className="text-red-500 text-sm">{errors.stallNumber.message}</p>}
        </div>

        <div>
          <label className="block font-medium">Використання</label>
          <input {...register('using')} className="w-full p-2 border rounded" />
          {errors.using && <p className="text-red-500 text-sm">{errors.using.message}</p>}
        </div>

        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Додати коня
        </button>
      </form>
    </div>
  );
}
