import { createContext, useContext, useState } from "react";

const PageContext = createContext();

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
export const usePage = () => useContext(PageContext);
