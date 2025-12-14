import { Route } from '@/routes/training-aplications/$trainingAplicationId';

export function TrainingAplicationsEditPage() {
  const { TrainingAplicationId } = Route.useParams();

  return <h1>Редагування заявки на тренування #{TrainingAplicationId}</h1>;
}