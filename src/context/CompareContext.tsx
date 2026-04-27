"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface Vehicle {
  id: string | number;
  name: string;
  year: string;
  mileage: string;
  price: string;
  image_url: string;
  category: string;
  location: string;
}

interface CompareContextType {
  selectedVehicles: Vehicle[];
  addToCompare: (vehicle: Vehicle) => void;
  removeFromCompare: (id: string | number) => void;
  clearCompare: () => void;
  isInCompare: (id: string | number) => boolean;
  compareError: string | null;
  clearError: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [selectedVehicles, setSelectedVehicles] = useState<Vehicle[]>([]);
  const [compareError, setCompareError] = useState<string | null>(null);

  // Load from localStorage on mount only
  useEffect(() => {
    try {
      const saved = localStorage.getItem("benz_compare");
      if (saved) setSelectedVehicles(JSON.parse(saved));
    } catch {
      localStorage.removeItem("benz_compare");
    }
  }, []);

  // Persist to localStorage whenever selection changes
  useEffect(() => {
    localStorage.setItem("benz_compare", JSON.stringify(selectedVehicles));
  }, [selectedVehicles]);

  const addToCompare = useCallback((vehicle: Vehicle) => {
    setSelectedVehicles((prev) => {
      if (prev.length >= 3) {
        setCompareError("Maximum 3 véhicules à comparer.");
        return prev;
      }
      if (prev.find((v) => v.id === vehicle.id)) return prev;
      return [...prev, vehicle];
    });
  }, []);

  const removeFromCompare = useCallback((id: string | number) => {
    setSelectedVehicles((prev) => prev.filter((v) => v.id !== id));
  }, []);

  const clearCompare = useCallback(() => {
    setSelectedVehicles([]);
  }, []);

  const isInCompare = useCallback(
    (id: string | number) => selectedVehicles.some((v) => v.id === id),
    [selectedVehicles]
  );

  const clearError = useCallback(() => setCompareError(null), []);

  return (
    <CompareContext.Provider
      value={{ selectedVehicles, addToCompare, removeFromCompare, clearCompare, isInCompare, compareError, clearError }}
    >
      {children}
      {/* Non-blocking inline error toast */}
      {compareError && (
        <div
          role="alert"
          aria-live="assertive"
          className="fixed bottom-28 left-1/2 -translate-x-1/2 z-9999 bg-white text-black text-xs font-black uppercase tracking-widest px-6 py-3 rounded-full shadow-2xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          {compareError}
          <button onClick={clearError} className="text-black/50 hover:text-black transition-colors" aria-label="Fermer">✕</button>
        </div>
      )}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) throw new Error("useCompare must be used within a CompareProvider");
  return context;
}
