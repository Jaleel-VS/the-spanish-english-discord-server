import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  options: FilterOption[];
}

interface FilterBarProps {
  filters: FilterConfig[];
  selected: Record<string, string[]>;
  onChange: (key: string, value: string) => void;
  onRemove: (key: string, value: string) => void;
  onClear: () => void;
}

function FilterDropdown({
  filter,
  selected,
  onSelect,
}: {
  filter: FilterConfig;
  selected: string[];
  onSelect: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition-colors ${
          selected.length > 0
            ? 'border-[#fb923c]/50 bg-[#fb923c]/10 text-[#fb923c]'
            : 'border-slate-700 text-slate-300 hover:border-slate-600'
        }`}
      >
        <span>{filter.label}</span>
        {selected.length > 0 && (
          <span className="bg-[#fb923c] text-slate-900 text-xs px-1.5 py-0.5 rounded-full font-medium">
            {selected.length}
          </span>
        )}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-20 py-1">
          {filter.options.map((option) => {
            const isSelected = selected.includes(option.value);
            return (
              <button
                key={option.value}
                onClick={() => {
                  onSelect(option.value);
                }}
                className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                  isSelected
                    ? 'bg-[#fb923c]/20 text-[#fb923c]'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function FilterBar({ filters, selected, onChange, onRemove, onClear }: FilterBarProps) {
  const activeFilters = Object.entries(selected).flatMap(([key, values]) =>
    values.map((value) => {
      const filter = filters.find((f) => f.key === key);
      const option = filter?.options.find((o) => o.value === value);
      return { key, value, label: option?.label || value };
    })
  );

  const hasActiveFilters = activeFilters.length > 0;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {filters.map((filter) => (
          <FilterDropdown
            key={filter.key}
            filter={filter}
            selected={selected[filter.key] || []}
            onSelect={(value) => onChange(filter.key, value)}
          />
        ))}

        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="text-sm text-slate-500 hover:text-slate-300 transition-colors ml-2"
          >
            Clear all
          </button>
        )}
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map(({ key, value, label }) => (
            <span
              key={`${key}-${value}`}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 text-sm text-slate-300"
            >
              {label}
              <button
                onClick={() => onRemove(key, value)}
                className="hover:text-[#fb923c] transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
