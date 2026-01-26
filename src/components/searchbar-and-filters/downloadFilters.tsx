import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import FilterGroup from "./subcomp/filterGroup";

interface DownloadFiltersProps {
  searchTerm: string;
  selectedType: string;
  setSelectedType: (type: string) => void;
  selectedQuality: string;
  setSelectedQuality: (quality: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  handleNewSearch: () => void;
}

const DownloadFilters = ({
  searchTerm,
  selectedType,
  setSelectedType,
  selectedQuality,
  setSelectedQuality,
  sortBy,
  setSortBy,
  handleNewSearch,
}: DownloadFiltersProps & {}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div>
            Hai cercato la parola: <strong>{searchTerm}</strong>
          </div>
          {/* Filters */}
          <FilterGroup
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedQuality={selectedQuality}
            setSelectedQuality={setSelectedQuality}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
          <Button>Source</Button>
          <Button onClick={handleNewSearch}>New Search</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DownloadFilters;
