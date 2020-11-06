import React, { createContext, useContext, useState } from 'react';

// doing sanity checks, validation
// and providing default empty values if no settings have been passed from the backend
const initValues = window.wpreactdevOptions?.settings ?? {};
const initSelection = window.wpreactdevOptions?.selection ?? {};
const images = Array.isArray(initValues.images) ? initValues.images : [];
const savedUrl =
  initSelection.url && images.includes(initSelection.url)
    ? initSelection.url
    : false;
const postId = window.wpreactdevOptions?.postId ?? 0;

const FrontendContext = createContext();

// Provider
function FrontendContextProvider({ children, ...props }) {
  const [selected, setSelected] = useState(savedUrl);

  const settings = { url: selected };

  const SettingsInput = () => (
    <>
      <input
        type="hidden"
        value={JSON.stringify(settings)}
        name="wpreactdev-input-user-options"
      />
      <input type="hidden" value={postId} name="wpreactdev-input-post-id" />
    </>
  );

  return (
    <FrontendContext.Provider
      value={{ selected, setSelected, SettingsInput, images }}
    >
      {children}
    </FrontendContext.Provider>
  );
}

function useFrontendState() {
  const context = useContext(FrontendContext);
  if (context === undefined) {
    throw new Error(
      'useFrontendState must be used within a FrontendContextProvider'
    );
  }
  return context;
}

export { FrontendContextProvider, useFrontendState };
