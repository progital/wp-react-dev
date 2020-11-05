import React from 'react';
import { AdminContextProvider } from 'context/AdminContext';
import AdminPage from 'components/AdminPage';
import 'assets/scss/backend.scss';

const App = () => {
  return (
    <AdminContextProvider>
      <AdminPage />
    </AdminContextProvider>
  );
};

export default App;
