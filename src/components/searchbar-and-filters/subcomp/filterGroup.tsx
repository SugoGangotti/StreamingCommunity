import Filter from "./filter";
import { FilterIcon } from "lucide-react";

interface FilterGroupProps {
  selectedType: string;
  setSelectedType: (value: string) => void;
  selectedQuality: string;
  setSelectedQuality: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
}

const FilterGroup = ({
  selectedType,
  setSelectedType,
  selectedQuality,
  setSelectedQuality,
  sortBy,
  setSortBy,
}: FilterGroupProps) => {
  return (
    <div className="flex gap-2">
      <Filter
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        placeholder="Type"
        icon={FilterIcon}
        selectableOptions={[
          { value: "all", label: "All Types" },
          { value: "movie", label: "Movies" },
          { value: "series", label: "Series" },
          { value: "anime", label: "Anime" },
          { value: "documentary", label: "Documentaries" },
        ]}
      />

      <Filter
        selectedType={selectedQuality}
        setSelectedType={setSelectedQuality}
        placeholder="Quality"
        className="w-[120px]"
        selectableOptions={[
          { value: "all", label: "All Quality" },
          { value: "4K", label: "4K" },
          { value: "1080p", label: "1080p" },
          { value: "720p", label: "720p" },
        ]}
      />

      <Filter
        selectedType={sortBy}
        setSelectedType={setSortBy}
        placeholder="Sort"
        className="w-[120px]"
        selectableOptions={[
          { value: "latest", label: "Latest" },
          { value: "oldest", label: "Oldest" },
          { value: "rating", label: "Rating" },
          { value: "title", label: "Title" },
        ]}
      />
    </div>
  );
};

export default FilterGroup;
