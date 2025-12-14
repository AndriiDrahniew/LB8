import { Link, createFileRoute, Outlet } from '@tanstack/react-router';
import { useTradeReports, useDeleteTradeReport } from '@/features/TradeReports/api';
//import { TradeReportsListPage } from '@/features/TradeReports/pages/TradeReportsListPage';

export const Route = createFileRoute('/trade-reports')({
  component: TradeReportsLayout,
});

function TradeReportsLayout() {
  return (
    <div>
      <TradeReportsListPage />
      <Outlet />
    </div>
  );
}

function TradeReportsListPage() {
  const { data: reports, isLoading, isError, error } = useTradeReports();
  const deleteReportMutation = useDeleteTradeReport();

  const handleDelete = (id: number) => {
    if (window.confirm('Ви впевнені, що хочете видалити звіт?')) {
      deleteReportMutation.mutate(id);
    }
  };

  if (isLoading) return <div>Завантаження...</div>;
  if (isError) return <div>Помилка: {error.message}</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Trade Reports</h1>

        <Link
          to="/trade-reports/new"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Додати звіт
        </Link>
      </div>

      <table className="min-w-full bg-white text-sm">
        <thead>
          <tr>
            <th className="border px-2 py-2">ID</th>
            <th className="border px-2 py-2">Тип транзакції</th>
            <th className="border px-2 py-2">Вартість</th>
            <th className="border px-2 py-2">Імʼя</th>
            <th className="border px-2 py-2">Прізвище</th>
            <th className="border px-2 py-2">ID коня</th>
            <th className="border px-2 py-2">Дії</th>
          </tr>
        </thead>

        <tbody>
          {reports?.map((report) => (
            <tr key={report.id}>
              <td className="border px-2 py-1">{report.id}</td>
              <td className="border px-2 py-1">{report.actionType}</td>
              <td className="border px-2 py-1">{report.cost}</td>
              <td className="border px-2 py-1">{report.name}</td>
              <td className="border px-2 py-1">{report.surname}</td>
              <td className="border px-2 py-1">{report.horseId}</td>

              <td className="border px-2 py-1 text-center space-x-2">
                <Link
                  to="/trade-reports/$tradeReportId"
                  params={{ tradeReportId: String(report.id) }}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  Редагувати
                </Link>

                <button
                  onClick={() => handleDelete(report.id)}
                  disabled={deleteReportMutation.isPending}
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