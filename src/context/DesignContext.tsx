"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type DesignMode = "glass" | "neo";

interface DesignContextType {
  designMode: DesignMode;
  toggleDesignMode: () => void;
  setDesignMode: (mode: DesignMode) => void;
}

const DesignContext = createContext<DesignContextType | undefined>(undefined);

export function DesignProvider({ children }: { children: React.ReactNode }) {
  const [designMode, setDesignMode] = useState<DesignMode>("glass");

  useEffect(() => {
    const savedMode = localStorage.getItem("designMode") as DesignMode;
    if (savedMode === "neo" || savedMode === "glass") {
      setDesignMode(savedMode);
    }
  }, []);

  const changeDesignMode = (mode: DesignMode) => {
    setDesignMode(mode);
    localStorage.setItem("designMode", mode);
  };

  const toggleDesignMode = () => {
    const nextMode = designMode === "glass" ? "neo" : "glass";
    changeDesignMode(nextMode);
  };

  useEffect(() => {
    if (designMode === "neo") {
      document.body.classList.add("neo-mode");
    } else {
      document.body.classList.remove("neo-mode");
    }
  }, [designMode]);

  return (
    <DesignContext.Provider value={{ designMode, toggleDesignMode, setDesignMode: changeDesignMode }}>
      {children}
    </DesignContext.Provider>
  );
}

export function useDesign() {
  const context = useContext(DesignContext);
  if (context === undefined) {
    throw new Error("useDesign must be used within a DesignProvider");
  }
  return context;
}
