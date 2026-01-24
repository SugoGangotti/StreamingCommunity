import { Card, CardContent } from "../ui/card";
import Searchbar from "./subcomp/searchbar";
import FilterGroup from "./subcomp/filterGroup";

interface DownloadSearchbarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;

  selectedType: string;
  setSelectedType: (type: string) => void;
  selectedQuality: string;
  setSelectedQuality: (quality: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
}

const DownloadSearchbar = ({
  searchTerm,
  setSearchTerm,
  selectedType,
  setSelectedType,
  selectedQuality,
  setSelectedQuality,
  sortBy,
  setSortBy,
}: DownloadSearchbarProps & {}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <Searchbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

          {/* Filters */}
          <FilterGroup
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedQuality={selectedQuality}
            setSelectedQuality={setSelectedQuality}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DownloadSearchbar;
