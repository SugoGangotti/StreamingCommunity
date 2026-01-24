import { Search } from "lucide-react";
import { Card, CardContent } from "./ui/card";

const NoResults = () => {
  return (
    <Card className="border-dashed">
      <CardContent className="pt-6">
        <div className="text-center space-y-2">
          <Search className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="text-lg font-semibold">No results found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search terms or filters
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default NoResults;
