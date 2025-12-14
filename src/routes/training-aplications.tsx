import { Link, createFileRoute } from '@tanstack/react-router';
import { useTrainingAplications, useDeleteTrainingAplication } from '@/features/TrainingAplications/api';
//import { TrainingAplicationsListPage } from '@/features/TrainingAplications/pages/TrainingAplicationsListPage';

export const Route = createFileRoute('/training-aplications')({
  component: TrainingAplicationsListPage,
})

function TrainingAplicationsListPage() {
  const { data: aplications, isLoading, isError, error } =
    useTrainingAplications();
    console.log('REPORT FROM SERVER:', aplications);
  const deleteMutation = useDeleteTrainingAplication();

  const handleDelete = (id: number) => {
    if (window.confirm('Ви впевнені, що хочете видалити заявку?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div>Завантаження...</div>;
  if (isError) return <div>Помилка: {error.message}</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Training Aplications</h1>

        <Link
          to="/training-aplications/new"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Додати заявку
        </Link>
      </div>

      <table className="min-w-full bg-white text-sm">
        <thead>
          <tr>
            <th className="border px-2 py-2">ID</th>
            <th className="border px-2 py-2">Створено</th>
            <th className="border px-2 py-2">Тип тренування</th>
            <th className="border px-2 py-2">ID коня</th>
            <th className="border px-2 py-2">ID клієнта</th>
            <th className="border px-2 py-2">Статус</th>
            <th className="border px-2 py-2">Час тренування</th>
            <th className="border px-2 py-2">ID тренера</th>
            <th className="border px-2 py-2">Дії</th>
          </tr>
        </thead>

        <tbody>
          {aplications?.map((app) => (
            <tr key={app.id}>
              <td className="border px-2 py-1">{app.id}</td>
              <td className="border px-2 py-1">{app.lockedTime}</td>
              <td className="border px-2 py-1">{app.typeTraining}</td>
              <td className="border px-2 py-1">{app.horseId}</td>
              <td className="border px-2 py-1">{app.clientId}</td>
              <td className="border px-2 py-1">{app.state}</td>
              <td className="border px-2 py-1">{app.trainingTime}</td>
              <td className="border px-2 py-1">{app.trainerPassport}</td>

              <td className="border px-2 py-1 text-center space-x-2">
                <Link
                  to="/training-aplications/$trainingAplicationId"
                  params={{ trainingAplicationId: String(app.id) }}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  Редагувати
                </Link>

                <button
                  onClick={() => handleDelete(app.id)}
                  disabled={deleteMutation.isPending}
                  className="text-red-600 hover:text-red-900 disabled:opacity-50"
                >
                  Видалити
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
