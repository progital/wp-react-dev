import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useReducer,
} from 'react';

const initValues =
  (window.wpreactdevOptions && window.wpreactdevOptions.settings) || {};

const reducerImages = (state, { action, index, url } = {}) => {
  let newState = state;

  switch (action) {
    case 'remove': {
      newState = [...state];
      if (newState[index]) {
        newState = newState.filter((item, idx) => idx !== index);
      }
      break;
    }
    case 'add': {
      newState = [...state];
      // can insert item at certain index
      if (url && typeof index !== 'undefined') {
        newState[index] = url;
        newState = newState.filter((item) => item);
        break;
      }
      // appends an item at the end
      if (url) {
        newState.push(url);
      }
      break;
    }
  }

  return newState;
};

const AdminContext = createContext();

// Provider
function AdminContextProvider({ children, ...props }) {
  const [enabled, setEnabled] = useState(initValues.enabled || false);
  const [images, updateImages] = useReducer(
    reducerImages,
    Array.isArray(initValues.images) ? initValues.images : []
  );

  const settings = { enabled, images };

  const SettingsInput = () => (
    <input
      type="hidden"
      value={JSON.stringify(settings)}
      name="wpreactdev-input-admin-options"
    />
  );

  return (
    <AdminContext.Provider
      value={{ enabled, setEnabled, SettingsInput, images, updateImages }}
    >
      {children}
    </AdminContext.Provider>
  );
}

function useAdminState() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdminState must be used within a AdminContextProvider');
  }
  return context;
}

export { AdminContextProvider, useAdminState };
