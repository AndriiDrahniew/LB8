import { createFileRoute } from '@tanstack/react-router'
import { TrainingAplicationsCreatePage } from '@/features/TrainingAplications/pages/TrainingAplicationsCreatePage';

export const Route = createFileRoute('/training-aplications/new')({
  component: TrainingAplicationsCreatePage,
})

//function RouteComponent() {
//  return <div>Hello "/TrainingAplications/new"!</div>
//}
