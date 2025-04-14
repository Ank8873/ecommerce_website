import { StarIcon, Plus, Minus, Trash, ShoppingBag } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems, updateCartQuantity, deleteCartItem } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { setProductDetails } from "@/store/shop/products-slice";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";
import { categoryOptionsMap, productTypeMap } from "@/config";
import { useNavigate } from "react-router-dom";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [selectedSize, setSelectedSize] = useState("M");  
  const [currentPrice, setCurrentPrice] = useState(0);
  const [currentSalePrice, setCurrentSalePrice] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);

  const { toast } = useToast();

  const sizes = [
    { value: "XS", available: true },
    { value: "S", available: true },
    { value: "M", available: true },
    { value: "L", available: true },
    { value: "XL", available: true },
    { value: "XXL", available: true }
  ];

  // Calculate price based on selected size
  useEffect(() => {
    if (productDetails?.type === "size") {
      const basePrice = productDetails.price;
      const baseSalePrice = productDetails.salePrice;
      const increment = productDetails.percentageIncrement || 0;

      // If product is XXL, don't apply any increment
      if (productDetails.size === "XXL") {
        setCurrentPrice(basePrice);
        setCurrentSalePrice(baseSalePrice);
        return;
      }

      let priceIncrement = 0;
      if (["L", "XL"].includes(selectedSize)) {
        priceIncrement = increment;
      } else if (selectedSize === "XXL") {
        priceIncrement = increment * 2;
      }

      const calculatedPrice = basePrice + priceIncrement;
      const calculatedSalePrice =
        baseSalePrice > 0 ? baseSalePrice + priceIncrement : 0;

      setCurrentPrice(calculatedPrice);
      setCurrentSalePrice(calculatedSalePrice);
    } else {
      setCurrentPrice(productDetails?.price || 0);
      setCurrentSalePrice(productDetails?.salePrice || 0);
    }
  }, [productDetails, selectedSize]);

  // Reset size when product changes
  useEffect(() => {
    if (productDetails?.category === "kids") {
      setSelectedSize(productDetails?.size || "XS");
    } else if (productDetails?.type === "size") {
      // Set default size to M for oversize products, XS for others
      setSelectedSize(productDetails?.productType === "round_neck_oversize" ? "M" : "XS");
    }
  }, [productDetails]);

  useEffect(() => {
    // Update quantity if item is in cart
    const cartItem = cartItems?.items?.find(item => item.productId === productDetails?._id);
    if (cartItem) {
      setQuantity(cartItem.quantity);
    } else {
      setQuantity(0);
    }
  }, [cartItems, productDetails?._id]);

  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  function handleUpdateQuantity(action) {
    if (!productDetails || !user?.id) {
      toast({
        title: "Please login",
        description: "You need to be logged in to update cart",
        variant: "destructive",
      });
      return;
    }

    let newQuantity;
    if (action === "plus") {
      if (quantity + 1 > productDetails.totalStock) {
        toast({
          title: `Only ${productDetails.totalStock} items available in stock`,
          description: "Maximum stock limit reached",
          variant: "destructive",
        });
        return;
      }
      newQuantity = quantity + 1;
    } else {
      newQuantity = quantity - 1;
      if (newQuantity < 0) {
        toast({
          title: "Invalid quantity",
          description: "Quantity cannot be less than 0",
          variant: "destructive",
        });
        return;
      }
    }

    dispatch(
      updateCartQuantity({
        userId: user?.id,
        productId: productDetails._id,
        quantity: newQuantity
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Cart quantity updated successfully",
        });
      } else {
        toast({
          title: "Failed to update cart quantity",
          description: data?.payload?.message || "Please try again",
          variant: "destructive",
        });
      }
    });
  }

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    if (!user?.id) {
      toast({
        title: "Please login",
        description: "You need to be logged in to add items to cart",
        variant: "destructive",
      });
      return;
    }

    // Check if product is out of stock
    if (getTotalStock <= 0) {
      toast({
        title: "Out of Stock",
        description: "This product is currently out of stock",
        variant: "destructive",
      });
      return;
    }

    // Ensure all required fields are present
    if (!productDetails.title || !productDetails.category || !productDetails.productType) {
      toast({
        title: "Error adding to cart",
        description: "Product details are missing",
        variant: "destructive",
      });
      return;
    }

    // Check if item already exists in cart
    const cartItemExists = cartItems?.items?.find(
      (item) => item.productId === getCurrentProductId
    );

    if (cartItemExists) {
      handleUpdateQuantity("plus");
      return;
    }

    // Determine the size to use
    let sizeToUse = selectedSize;
    if (productDetails.type === "size" && productDetails.productType === "round_neck_oversize") {
      sizeToUse = selectedSize || "M"; // Use M as default for oversize if no size selected
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
        title: productDetails.title,
        price: currentSalePrice > 0 ? currentSalePrice : currentPrice,
        category: productDetails.category,
        productType: productDetails.productType,
        image: productDetails.image || "",
        type: productDetails.type || "",
        size: sizeToUse,
        measurement: productDetails.measurement || "",
        percentageIncrement: productDetails.percentageIncrement || 0
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Added to cart successfully",
        });
      } else {
        toast({
          title: "Failed to add to cart",
          description: data?.payload?.message || "Please try again",
          variant: "destructive",
        });
      }
    });
  }

  const handleClose = () => {
    setOpen(false);
    dispatch(setProductDetails(null));
    setQuantity(0);
    setSelectedSize("M");  
    setRating(0);
    setReviewMsg("");
  };

  useEffect(() => {
    return () => {
      // Cleanup when component unmounts
      handleClose();
    };
  }, []);

  const handleCheckout = () => {
    handleClose();
    navigate("/shop/checkout");
  };

  function handleDialogClose() {
    handleClose();
  }

  function handleAddReview() {
    if (!rating) {
      toast({
        title: "Please add a rating",
        variant: "destructive",
      });
      return;
    }

    if (!reviewMsg) {
      toast({
        title: "Please add a review message",
        variant: "destructive",
      });
      return;
    }

    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((response) => {
      const data = response.payload;
      if (data?.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails?._id));
        toast({
          title: "Review added successfully!",
        });
      } else {
        toast({
          title: "You need to purchase product to review it",
          description: data?.message || "Review Not Added",
          variant: "destructive",
        });
      }
    }).catch((error) => {
      toast({
        title: "Error adding review",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    });
  }

  useEffect(() => {
    if (productDetails !== null) dispatch(getReviews(productDetails?._id));
  }, [productDetails]);

  console.log(reviews, "reviews");

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;

  function handleCartItemDelete() {
    if (!productDetails?._id || !user?.id) return;

    dispatch(
      deleteCartItem({ 
        userId: user?.id, 
        productId: productDetails._id 
      })
    ).then((data) => {
      if (data?.payload?.success) {
        setQuantity(0);
        toast({
          title: "Item removed from cart",
        });
      } else {
        toast({
          title: "Failed to remove item",
          description: data?.payload?.message || "Please try again",
          variant: "destructive",
        });
      }
    }).catch((error) => {
      toast({
        title: "Error removing item",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="flex flex-col sm:grid sm:grid-cols-2 gap-4 sm:gap-8 p-4 sm:p-12 max-w-[95vw] sm:max-w-[80vw] lg:max-w-[70vw] max-h-[85vh] overflow-y-auto">
        <div className="relative rounded-lg h-[35vh] sm:h-auto shrink-0">
          <img
            src={productDetails?.image}
            alt={productDetails?.title}
            width={600}
            height={600}
            className="w-full h-full sm:h-auto sm:w-auto object-contain"
          />
        </div>
        <div className="flex flex-col min-h-0 sm:min-h-full">
          <div className="flex-1 overflow-y-auto">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold">{productDetails?.title}</h1>
              <p className="text-muted-foreground text-lg sm:text-2xl mb-3 sm:mb-5 mt-2 sm:mt-4">
                {productDetails?.description}
              </p>
            </div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                    ₹{currentSalePrice > 0 ? currentSalePrice : currentPrice}
                  </p>
                  {currentSalePrice > 0 && (
                    <p className="text-xl sm:text-2xl font-medium text-gray-400 line-through">
                      ₹{currentPrice}
                    </p>
                  )}
                </div>
                {productDetails?.type === "size" && (
                  <p className="text-sm text-gray-500 mt-1">
                    *Price may vary based on size selection
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-8">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Category</h3>
                <p className="mt-1 text-base font-medium text-gray-900">{categoryOptionsMap[productDetails?.category] || productDetails?.category}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Product Type</h3>
                <p className="mt-1 text-base font-medium text-gray-900">{productTypeMap[productDetails?.productType] || productDetails?.productType}</p>
              </div>
              {productDetails?.type === "size" && (
                <div className="col-span-2 sm:col-span-1">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Select Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {sizes
                      .filter(size => {
                        if (productDetails?.productType === "round_neck_oversize") {
                          // Only show M, L, XL, XXL for oversize
                          return ["M", "L", "XL", "XXL"].includes(size.value);
                        }
                        // Show all sizes for other products
                        return true;
                      })
                      .map((size) => (
                        <Button
                          key={size.value}
                          variant={selectedSize === size.value ? "default" : "outline"}
                          className="px-4 py-2"
                          onClick={() => setSelectedSize(size.value)}
                          disabled={productDetails?.size === "XXL" && size.value !== "XXL"}
                        >
                          {size.value}
                        </Button>
                      ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Size {selectedSize} selected
                  </p>
                </div>
              )}
            </div>
            {productDetails?.category === "kids" && 
            <div className="flex flex-col gap-4 mb-4">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">
                  Age Group:
                  </span>
                  <span className="font-medium">{productDetails?.size}</span>
                </div>
              </div>
            </div>}

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                {quantity > 0 ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-2 py-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleUpdateQuantity("minus")}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleUpdateQuantity("plus")}
                        disabled={quantity >= productDetails?.totalStock}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 py-2">
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={handleCartItemDelete}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                      {cartItems?.items?.length > 0 && (
                        <Button 
                          onClick={handleCheckout}
                          className="flex items-center gap-2 w-full sm:w-auto"
                        >
                          <ShoppingBag className="h-4 w-4" />
                          <span className="whitespace-nowrap">Proceed to Checkout</span>
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={() =>
                      handleAddToCart(productDetails?._id, productDetails?.totalStock)
                    }
                    className="w-full sm:w-auto"
                  >
                    Add to Cart
                  </Button>
                )}
              </div>
            </div>
            <Separator />
            <div className="max-h-[250px] sm:max-h-[300px] overflow-auto mt-4">
              <h2 className="text-lg sm:text-xl font-bold mb-4">Reviews</h2>
              <div className="grid gap-4 sm:gap-6">
                {reviews && reviews.length > 0 ? (
                  reviews.map((reviewItem) => (
                    <div className="flex gap-3 sm:gap-4">
                      <Avatar className="w-8 h-8 sm:w-10 sm:h-10 border">
                        <AvatarFallback>
                          {reviewItem?.userName[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid gap-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm sm:text-base">{reviewItem?.userName}</h3>
                        </div>
                        <div className="flex items-center gap-0.5">
                          <StarRatingComponent rating={reviewItem?.reviewValue} />
                        </div>
                        <p className="text-sm sm:text-base text-muted-foreground">
                          {reviewItem.reviewMessage}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <h1 className="text-sm sm:text-base">No Reviews</h1>
                )}
              </div>
              <div className="mt-6 sm:mt-10 flex-col flex gap-2">
                <Label className="text-sm sm:text-base">Write a review</Label>
                <div className="flex gap-1">
                  <StarRatingComponent
                    rating={rating}
                    handleRatingChange={handleRatingChange}
                  />
                </div>
                <Input
                  name="reviewMsg"
                  value={reviewMsg}
                  onChange={(event) => setReviewMsg(event.target.value)}
                  placeholder="Write a review..."
                  className="text-sm sm:text-base"
                />
                <Button
                  onClick={handleAddReview}
                  disabled={reviewMsg.trim() === ""}
                  className="text-sm sm:text-base"
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </div>
        
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;
