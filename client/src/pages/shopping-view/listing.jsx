import ProductFilter from "@/components/shopping-view/filter";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { sortOptions, categories } from "@/config";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
  setInitialFilters,
  setSort,
  updateFilters,
} from "@/store/shop/products-slice";
import { ArrowUpDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

function createSearchParamsHelper(filterParams) {
  if (!filterParams || Object.keys(filterParams).length === 0) {
    return '';
  }

  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      // For category and age, only use the first value
      if (key === 'category' || key === 'age') {
        queryParams.push(`${key}=${encodeURIComponent(value[0])}`);
      } else {
        const paramValue = value.join(",");
        queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
      }
    }
  }

  return queryParams.join("&");
}

function ShoppingListing() {
  const dispatch = useDispatch();
  const { productList, productDetails, filters, sort, isLoading } = useSelector(
    (state) => state.shopProducts
  );
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const [searchParams, setSearchParams] = useSearchParams();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Set initial sort
    dispatch(setSort("price-lowtohigh"));
    
    // Get filters from URL parameters
    const urlFilters = {};
    const category = searchParams.get('category');
    const age = searchParams.get('age');
    const productType = searchParams.get('productType');
    
    if (age) {
      urlFilters.age = [age.split(',')[0]];
    } else if (category && Object.keys(categories).includes(category)) {
      urlFilters.category = [category];
    }
    
    if (productType) {
      urlFilters.productType = productType.split(',');
    }
    
    // If we have URL parameters, use them. Otherwise, try to get from sessionStorage
    if (Object.keys(urlFilters).length > 0) {
      dispatch(setInitialFilters(urlFilters));
      sessionStorage.setItem("filters", JSON.stringify(urlFilters));
    } else {
      const storedFilters = JSON.parse(sessionStorage.getItem("filters")) || {};
      dispatch(setInitialFilters(storedFilters));
    }
  }, []);

  // Update URL when filters change
  useEffect(() => {
    if (Object.keys(filters).length === 0) {
      setSearchParams({});
      sessionStorage.removeItem("filters");
    } else {
      const queryString = createSearchParamsHelper(filters);
      if (queryString) {
        setSearchParams(queryString);
      }
      sessionStorage.setItem("filters", JSON.stringify(filters));
    }
  }, [filters]);

  // Fetch products when filters or sort changes
  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({ 
        filterParams: filters, 
        sortParams: sort 
      })
    );
  }, [dispatch, sort, filters]);

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  function handleFilter(getSectionId, getCurrentOption) {
    dispatch(updateFilters({ getSectionId, getCurrentOption }));
  }

  function handleSort(value) {
    dispatch(setSort(value));
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProduct, getTotalStock) {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProduct._id
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });
          return;
        }
      }
    }

    // Ensure all required fields are present according to Cart model
    if (!getCurrentProduct.title || !getCurrentProduct.category || !getCurrentProduct.productType) {
      toast({
        title: "Error adding to cart",
        description: "Product details are missing",
        variant: "destructive",
      });
      return;
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProduct._id,
        quantity: 1,
        title: getCurrentProduct.title,
        price: getCurrentProduct.salePrice > 0 ? getCurrentProduct.salePrice : getCurrentProduct.price,
        category: getCurrentProduct.category,
        productType: getCurrentProduct.productType,
        image: getCurrentProduct.image || "",
        type: getCurrentProduct.type || "",
        size: getCurrentProduct.size || "",
        measurement: getCurrentProduct.measurement || "",
        percentageIncrement: getCurrentProduct.percentageIncrement || 0
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      } else {
        toast({
          title: "Failed to add product to cart",
          description: data?.payload?.message || "Please try again",
          variant: "destructive",
        });
      }
    }).catch((error) => {
      toast({
        title: "Error adding product to cart",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
      <ProductFilter filters={filters} handleFilter={handleFilter} />
      <div className="bg-background w-full rounded-lg shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-extrabold">All Products</h2>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">
              {productList?.length} Products
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span>Sort by</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      value={sortItem.id}
                      key={sortItem.id}
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : productList && productList.length > 0
            ? productList.map((productItem) => (
                <ShoppingProductTile
                  handleGetProductDetails={handleGetProductDetails}
                  product={productItem}
                  handleAddtoCart={handleAddtoCart}
                />
              ))
            : (
              <div className="text-center py-8">
                <h2 className="text-xl font-semibold">No products found</h2>
                <p className="text-gray-500 mt-2">Try adjusting your filters</p>
              </div>
            )}
        </div>
      </div>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingListing;
