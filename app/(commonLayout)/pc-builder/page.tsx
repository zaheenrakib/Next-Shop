import PCBuilderDashboard from '@/components/pc-builder/BuilderDashboard';

export const metadata = {
  title: 'PC Builder | NextBazaar',
  description: 'Assemble your custom PC with our advanced builder tool.',
};

export default function PCBuilderPage() {
  return (
    <main className="min-h-screen bg-background">
      <PCBuilderDashboard />
    </main>
  );
}
