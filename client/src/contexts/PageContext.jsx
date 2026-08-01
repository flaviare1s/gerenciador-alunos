import { createContext, useContext, useState } from "react";

const defaultPageData = {
  title: "Gerenciador de alunos",
  subtitle: "",
  onDelete: null,
};

const PageContext = createContext({ pageData: defaultPageData, setPageData: () => { } });

export const PageProvider = ({ children }) => {
  const [pageData, setPageData] = useState({
    title: "Gerenciador de alunos",
    subtitle: "",
    onDelete: null,
  });

  return (
    <PageContext.Provider value={{ pageData, setPageData }}>
      {children}
    </PageContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
// Return context value or a safe fallback when used outside a provider
// This prevents runtime errors in tests that render components without the provider.
// eslint-disable-next-line react-refresh/only-export-components
export const usePage = () => {
  const ctx = useContext(PageContext);
  if (!ctx) {
    return { pageData: defaultPageData, setPageData: () => { } };
  }
  return ctx;
};
