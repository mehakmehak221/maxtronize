import Header from '@/components/Header';
import PageContent from '@/components/PageContent';

export default function Home() {
  return (
    <div className="te-app">
      <Header />
      <main>
        <PageContent />
      </main>
    </div>
  );
}
