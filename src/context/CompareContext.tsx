"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

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
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [selectedVehicles, setSelectedVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("benz_compare");
    if (saved) {
      try {
        setSelectedVehicles(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse compare data", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("benz_compare", JSON.stringify(selectedVehicles));
  }, [selectedVehicles]);

  const addToCompare = (vehicle: Vehicle) => {
    if (selectedVehicles.length >= 3) {
      alert("Vous ne pouvez comparer que 3 véhicules au maximum.");
      return;
    }
    if (!selectedVehicles.find((v) => v.id === vehicle.id)) {
      setSelectedVehicles([...selectedVehicles, vehicle]);
    }
  };

  const removeFromCompare = (id: string | number) => {
    setSelectedVehicles(selectedVehicles.filter((v) => v.id !== id));
  };

  const clearCompare = () => {
    setSelectedVehicles([]);
  };

  const isInCompare = (id: string | number) => {
    return !!selectedVehicles.find((v) => v.id === id);
  };

  return (
    <CompareContext.Provider
      value={{
        selectedVehicles,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
}
