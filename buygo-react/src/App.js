import 'App.css';
import Header from 'containers/header/Header';
import Visual from 'containers/visual/Visual';

import { Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Footer from 'containers/footer/Footer';

const queryClient = new QueryClient();

function App() {
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <Header />
        <Visual />
        <Outlet />
        <Footer />
      </QueryClientProvider>
    </div>
  );
}

export default App;
