import { Route } from '@/routes/training-aplications/$trainingAplicationId';

export function TrainingAplicationsEditPage() {
  const { trainingAplicationId } = Route.useParams();

  return <h1>Редагування заявки на тренування #{trainingAplicationId}</h1>;
}