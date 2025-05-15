import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@material-tailwind/react';
import { Search } from 'lucide-react';

interface OptionType {
  _id: string;
  item_name: string;
  price?: number;
}

interface MTAutocompleteProps {
  options: OptionType[];
  value: string | undefined;
  onChange: (value: string) => void;
  onSelect: (option: OptionType) => void;
  label: string;
  placeholder?: string;
  className?: string;
}

export const MTAutocomplete: React.FC<MTAutocompleteProps> = ({
  options,
  value,
  onChange,
  onSelect,
  label,
  placeholder = 'Search...',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    option.item_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    onChange(newValue);
    setIsOpen(true);
  };

  const handleSelect = (option: OptionType) => {
    setSearchTerm(option.item_name);
    onSelect(option);
    setIsOpen(false);
  };

  const selectedItem = options.find(opt => opt._id === value);

  return (
    <div className={`relative ${className}`} ref={wrapperRef}>
      <div className="relative">
        <div className="relative">
          <Input
            type="text"
            label={label}
            value={searchTerm || selectedItem?.item_name || ''}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className="pr-8"
            crossOrigin="anonymous"
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Search className="h-4 w-4 text-gray-500" />
          </div>
        </div>
      </div>

      {isOpen && filteredOptions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredOptions.map((option) => (
            <div
              key={option._id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
              onClick={() => handleSelect(option)}
            >
              <span>{option.item_name}</span>
              {option.price !== undefined && (
                <span className="text-sm text-gray-500">₹{option.price.toFixed(2)}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MTAutocomplete;
