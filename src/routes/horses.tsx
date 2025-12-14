import { Link, createFileRoute, Outlet } from '@tanstack/react-router';
import { useHorses, useDeleteHorse } from '@/features/horses/api';
//import { HorsesListPage } from '@/features/horses/pages/HorsesListPage';

export const Route = createFileRoute('/horses')({
  component: HorsesLayout,
});

function HorsesLayout() {
  return (
    <div>
      <HorsesListPage />

      <Outlet />
    </div>
  );
}

function HorsesListPage() {
  const { data: horses, isLoading, isError, error } = useHorses();
  const deleteHorseMutation = useDeleteHorse();

  const handleDelete = (id: number) => {
    if (window.confirm('Ви впевненні, що бажаєте видалити цього коня?')) {
      deleteHorseMutation.mutate(id);
    }
  };

  if (isLoading) return <div>Завантаження...</div>;

  if (isError) return <div>Помилка завантаження: {error.message}</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Коні</h1>

        <Link
          to="/horses/new"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Додати нового коня
        </Link>
      </div>

      <table className="min-w-full bg-white text-sm">
        <thead>
          <tr>
            <th className="border px-2 py-2">Id</th>
            <th className="border px-2 py-2">Ім'я</th>
            <th className="border px-2 py-2">Порода</th>
            <th className="border px-2 py-2">Вік</th>
            <th className="border px-2 py-2">Власник</th>
            <th className="border px-2 py-2">Вага</th>
            <th className="border px-2 py-2">Зріст</th>
            <th className="border px-2 py-2">Стать</th>
            <th className="border px-2 py-2">Дії</th>
          </tr>
        </thead>

        <tbody>
          {horses?.map((horse) => (
            <tr key={horse.id}>
              <td className="border px-2 py-1">{horse.id}</td>
              <td className="border px-2 py-1">{horse.name}</td>
              <td className="border px-2 py-1">{horse.breed}</td>
              <td className="border px-2 py-1">{horse.age}</td>
              <td className="border px-2 py-1">{horse.owner}</td>
              <td className="border px-2 py-1">{horse.weight}</td>
              <td className="border px-2 py-1">{horse.height}</td>
              <td className="border px-2 py-1">{horse.sex}</td>

              <td className="py-2 px-4 border-b text-center">
                <Link
                  to="/horses/$horseId"
                  params={{ horseId: String(horse.id) }}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  Редагувати
                </Link>

                <button
                  onClick={() => handleDelete(horse.id)}
                  disabled={deleteHorseMutation.isPending}
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