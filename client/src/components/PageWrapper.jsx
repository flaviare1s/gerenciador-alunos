import { useState, useEffect } from "react";

/**
 * Tentei criar esse componente para fazer uma transição suave entre páginas, suavizando a impressão de que as páginas ficavam "sambando" ao apertar no botão de toggle.
 * 
 * Porém, não consegui fazer com que a transição ficasse boa o suficiente, mas mantive o componente, pois pretendo tentar melhorar essa funcionalidade.
 */

export const PageWrapper = ({ children }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 500);

    return () => {
      clearTimeout(timeout);
      setVisible(false);
    };
  }, [children]);

  return (
    <div
      className={`transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"
        }`}
    >
      {children}
    </div>
  );
};
