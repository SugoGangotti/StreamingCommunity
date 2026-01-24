import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { LucideIcon } from "lucide-react";

interface FilterProps {
  selectedType: string;
  setSelectedType: (value: string) => void;
  placeholder: string;
  selectableOptions: { value: string; label: string }[];
  icon?: LucideIcon;
  className?: string;
}

const Filter = ({
  selectedType,
  setSelectedType,
  placeholder,
  selectableOptions,
  icon: Icon,
  className,
}: FilterProps) => {
  return (
    <Select value={selectedType} onValueChange={setSelectedType}>
      <SelectTrigger className={`w-[140px] ${className || ""}`}>
        {Icon && <Icon className="h-4 w-4 mr-2" />}
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent>
        {selectableOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default Filter;
