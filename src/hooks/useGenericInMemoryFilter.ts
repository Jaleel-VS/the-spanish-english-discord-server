import { useState } from "react";

/**
 * This hook is used to manage a generic filter in memory, for more see components/FilterBar.tsx  
 * @param initialState - The initial state of the filter
 * @returns The selected filters, the toggle filter function, 
 * the remove filter function, the clear filters function, and the is filter active function
 */
export const useGenericInMemoryFilter = <T extends Record<string, string[]>>(initialState: T) => {
  const [selected, setSelected] = useState<T>(initialState);


  const toggleFilter = (key: string, value: string) => {
    setSelected((prev) => {
      const current = prev[key] || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [key]: updated };
    });
  };

  const removeFilter = (key: string, value: string) => {
    setSelected((prev) => ({
      ...prev,
      [key]: (prev[key] || []).filter((v) => v !== value),
    }));
  };

  const clearFilters = () => setSelected(initialState);

  const isFilterActive = (key: string, value: string) => {
    return (selected[key] || []).includes(value);
  };

  return { selected, toggleFilter, removeFilter, clearFilters, isFilterActive };
};
