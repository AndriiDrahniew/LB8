import { Route } from '@/routes/trade-reports/$tradeReportId';

export function TradeReportsEditPage() {
  const { tradeReportId } = Route.useParams();

  return <h1>Редагування відомості про торгівлю #{tradeReportId}</h1>;
}