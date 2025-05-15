//@ts-nocheck
import { Input, Card, List, ListItem, Spinner } from "@material-tailwind/react";
import { useEffect, useState, useCallback } from "react";
import useApiRequest from "../../utils/hooks/useApi";
import { debounce } from "lodash"; // Optional: smooth UX

export default function AutoCompleteInput({ endpoint, label = "Search" }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showList, setShowList] = useState(false);
  const { loading, apiRequest } = useApiRequest();

  const fetchData = useCallback(
    debounce(async (searchTerm) => {
      const res = await apiRequest("GET", `${endpoint}?search=${searchTerm}`);
      if (res) {
        setResults(res);
        setShowList(true);
      }
    }, 300),
    [endpoint]
  );

  useEffect(() => {
    if (query.length > 1) {
      fetchData(query);
    } else {
      setResults([]);
      setShowList(false);
    }
  }, [query, fetchData]);

  const handleSelect = (item) => {
    setQuery(item.name);
    setShowList(false);
  };

  return (
    <div className="relative w-72">
      <Input
        label={label}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() =>
          query.length > 1 && results.length > 0 && setShowList(true)
        }
      />
      {loading && (
        <div className="absolute top-full left-0 mt-1 flex justify-center w-full">
          <Spinner className="h-5 w-5" />
        </div>
      )}
      {showList && results.length > 0 && (
        <Card className="absolute z-10 w-full mt-1 max-h-60 overflow-y-auto">
          <List>
            {results.map((item) => (
              <ListItem
                key={item._id || item.id}
                onClick={() => handleSelect(item)}
                className="cursor-pointer"
              >
                {item.name}
              </ListItem>
            ))}
          </List>
        </Card>
      )}
    </div>
  );
}
