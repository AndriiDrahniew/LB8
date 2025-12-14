import { createFileRoute } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateTradeReport } from '@/features/TradeReports/api';

const tradeReportSchema = z.object({
  actionType: z.string().min(2, 'Тип дії занадто короткий'),
  cost: z.number().positive('Вартість повинна бути додатною'),
  name: z.string().min(2, 'Імʼя занадто коротке'),
  surname: z.string().min(2, 'Прізвище занадто коротке'),
  horseId: z.number().int().positive('ID коня повинно бути додатним'),
});

type TradeReportFormData = z.infer<typeof tradeReportSchema>;

export const Route = createFileRoute('/trade-reports/new')({
  component: TradeReportsCreatePage,
});

function TradeReportsCreatePage() {
  const createTradeReport = useCreateTradeReport();
  const { register, handleSubmit, formState: { errors } } = useForm<TradeReportFormData>({
    resolver: zodResolver(tradeReportSchema),
  });

  const onSubmit = (data: TradeReportFormData) => {
    createTradeReport.mutate(data);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Додати новий звіт</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium">Тип транзакції</label>
          <input {...register('actionType')} className="w-full p-2 border rounded" />
          {errors.actionType && <p className="text-red-500 text-sm">{errors.actionType.message}</p>}
        </div>

        <div>
          <label className="block font-medium">Вартість</label>
          <input type="number" {...register('cost', { valueAsNumber: true })} className="w-full p-2 border rounded" />
          {errors.cost && <p className="text-red-500 text-sm">{errors.cost.message}</p>}
        </div>

        <div>
          <label className="block font-medium">Імʼя</label>
          <input {...register('name')} className="w-full p-2 border rounded" />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block font-medium">Прізвище</label>
          <input {...register('surname')} className="w-full p-2 border rounded" />
          {errors.surname && <p className="text-red-500 text-sm">{errors.surname.message}</p>}
        </div>

        <div>
          <label className="block font-medium">ID коня</label>
          <input type="number" {...register('horseId', { valueAsNumber: true })} className="w-full p-2 border rounded" />
          {errors.horseId && <p className="text-red-500 text-sm">{errors.horseId.message}</p>}
        </div>

        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Додати звіт
        </button>
      </form>
    </div>
  );
}