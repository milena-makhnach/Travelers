import { FC } from 'react';
import { Header } from './components/header';

export const App: FC = () => {
  return (
    <div className="bg-white">
      <Header />
      <main className="container">content</main>
    </div>
  );
};
