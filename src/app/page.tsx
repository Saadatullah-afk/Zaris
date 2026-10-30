import CustomerLayout from '@/app/(customer)/layout';
import HomePage from '@/app/(customer)/page';

export const revalidate = 0;

export default function RootPage() {
  return (
    <CustomerLayout>
      <HomePage />
    </CustomerLayout>
  );
}
