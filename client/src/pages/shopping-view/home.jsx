import { Button } from "@/components/ui/button";
import {
  BabyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ShirtIcon,
  SparklesIcon,
  Flower,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";
import { motion, AnimatePresence } from "framer-motion";
import { categories, productTypes, sizes, kidsAgeGuide } from "@/config";

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {};
    const searchParams = new URLSearchParams();
    
    if (section === 'category') {
      const categoryKey = Object.keys(categories).find(
        key => categories[key].label === getCurrentItem.label
      );
      currentFilter.category = [categoryKey];
      searchParams.set('category', categoryKey);
    } else if (section === 'productType') {
      currentFilter.productType = [getCurrentItem.id];
      searchParams.set('productType', getCurrentItem.id);
    } else {
      currentFilter[section] = [getCurrentItem.id];
      searchParams.set(section, getCurrentItem.id);
    }
    
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing?${searchParams.toString()}`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [featureImageList]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative w-full h-[600px] overflow-hidden">
        <AnimatePresence mode="wait">
          {featureImageList && featureImageList.length > 0 && (
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <img
                src={featureImageList[currentSlide]?.image}
                alt={`Slide ${currentSlide + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="text-center">
                  <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-5xl md:text-6xl font-bold text-white mb-4"
                  >
                    Arrive for Fashion
                  </motion.h1>
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-xl text-white/90 mb-8"
                  >
                    Discover the latest trends in fashion
                  </motion.p>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Button
                      onClick={() => navigate("/shop/listing")}
                      className="bg-white text-black hover:bg-white/90"
                    >
                      Shop Now
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <Button
          variant="outline"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) =>
                (prevSlide - 1 + featureImageList.length) % featureImageList.length
            )
          }
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
          onClick={() =>
            setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length)
          }
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* Categories Section */}
      <section className="py-16 px-4 md:px-8">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.entries(categories).map(([key, category]) => (
              <div
                key={key}
                onClick={() => handleNavigateToListingPage({ id: key, label: category.label }, 'category')}
                className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer bg-white"
              >
                <div className="p-6 flex flex-col items-center">
                  {category.icon && <category.icon size={48} className="mb-4" />}
                  <h3 className="text-xl font-semibold mb-2">{category.label}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Types Section */}
      <section className="py-16 px-4 md:px-8 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Product Type</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productTypes.map((type) => (
              <div
                key={type.id}
                onClick={() => navigate('/shop/listing')}
                className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer bg-white p-4"
              >
                <div className="flex flex-col items-center">
                  <ShirtIcon size={32} className="mb-3" />
                  <h3 className="text-sm md:text-base font-medium text-center">{type.label}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Size Guide Section */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="container mx-auto py-16 px-4"
      >
        <div className="flex items-center justify-center gap-2 mb-12">
          <SparklesIcon className="w-6 h-6 text-black" />
          <h2 className="text-3xl font-bold text-center text-black">Size Guide</h2>
        </div>

        <div className="mb-16">
          <h3 className="text-2xl font-semibold mb-6 text-center text-black">Adult Sizes</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {sizes.map((size, index) => (
              <motion.div
                key={size.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-gray-100">
                  <h3 className="text-3xl font-bold mb-3 text-black">{size.label}</h3>
                  <div className="space-y-2 text-gray-600">
                    <p>Size: {size.size}</p>
                    <p>Chest: {size.chest}"</p>
                    <p>Waist: {size.waist}"</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-semibold mb-6 text-center text-black">Kids Size Guide</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {kidsAgeGuide.map((range, index) => (
              <motion.div
                key={range.age}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.6 }}
                className="group"
              >
                <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-gray-100">
                  <h3 className="text-2xl font-bold mb-4 text-black">{range.age}</h3>
                  <div className="space-y-3 text-gray-600">
                    <div className="flex items-center justify-between">
                      <span>Height:</span>
                      <span className="font-semibold">{range.height}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Chest:</span>
                      <span className="font-semibold">{range.chest}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Waist:</span>
                      <span className="font-semibold">{range.waist}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div> */}

      {/* Featured Products Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="container mx-auto py-16 px-4"
      >
        <div className="flex items-center justify-center gap-2 mb-12">
          <SparklesIcon className="w-6 h-6 text-black" />
          <h2 className="text-3xl font-bold text-center text-black">Featured Products</h2>
        </div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {productList?.slice(0, 8).map((product, index) => (
            <motion.div
              key={product._id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <ShoppingProductTile
                product={product}
                handleAddtoCart={handleAddtoCart}
                handleGetProductDetails={handleGetProductDetails}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;
