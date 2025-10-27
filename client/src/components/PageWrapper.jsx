import { useState, useEffect } from "react";

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
