import { filterOptions } from "@/config";
import { Fragment, useState, useEffect } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "../ui/button";

function ProductFilter({ filters, handleFilter }) {
  const [isMobile, setIsMobile] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState({});

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    checkMobile();
    
    // Set initial collapsed state for mobile
    if (window.innerWidth <= 768) {
      const initialState = Object.keys(filterOptions).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {});
      setCollapsedSections(initialState);
    }

    // Add resize listener
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSection = (section) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="bg-background rounded-lg shadow-sm">
      <div className="p-0 md:p-4 border-b">
        <h2 className="text-lg font-extrabold">Filters</h2>
      </div>
      <div className="p-0 md:p-4 space-y-4">
        {Object.keys(filterOptions).map((keyItem) => (
          <Fragment key={keyItem}>
            <div>
              <Button
                variant="ghost"
                className="w-full flex justify-between items-center py-2"
                onClick={() => toggleSection(keyItem)}
              >
                <h3 className="text-base font-bold">{keyItem}</h3>
                {collapsedSections[keyItem] ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
              {!collapsedSections[keyItem] && (
                <div className="grid gap-2 mt-0 md:mt-2">
                  {filterOptions[keyItem].map((option) => (
                    <Label key={option.id} className="flex font-medium items-center gap-2">
                      <Checkbox
                        checked={
                          filters &&
                          Object.keys(filters).length > 0 &&
                          filters[keyItem] &&
                          filters[keyItem].indexOf(option.id) > -1
                        }
                        onCheckedChange={() => handleFilter(keyItem, option.id)}
                      />
                      {option.label}
                    </Label>
                  ))}
                </div>
              )}
            </div>
            <Separator />
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default ProductFilter;
