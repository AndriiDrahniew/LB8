import { Route } from '@/routes/horses/$horseId';

export function HorsesEditPage() {
  const { horseId } = Route.useParams();

  return <h1>Редагування коня #{horseId}</h1>;
}