import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { useEffect } from "react";
import { fetchAllFilteredProducts } from "@/store/shop/products-slice";

function UserCartItemsContent({ cartItem }) {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productList } = useSelector((state) => state.shopProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  useEffect(() => {
    if (!productList || productList.length === 0) {
      dispatch(fetchAllFilteredProducts({ filterParams: {}, sortParams: "" }));
    }
  }, [dispatch, productList]);

  const formatProductType = (type) => {
    if (!type) return "";
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  function handleUpdateQuantity(getCartItem, typeOfAction) {
    if (typeOfAction === "plus") {
      let getCartItems = cartItems.items || [];

      if (getCartItems.length) {
        const indexOfCurrentCartItem = getCartItems.findIndex(
          (item) => item.productId === getCartItem?.productId
        );

        const currentProduct = productList?.find(
          (product) => product._id === getCartItem?.productId
        );

        if (!currentProduct) {
          toast({
            title: "Product not found",
            variant: "destructive",
          });
          return;
        }

        const getTotalStock = currentProduct.totalStock;

        if (indexOfCurrentCartItem > -1) {
          const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;
          if (getQuantity + 1 > getTotalStock) {
            toast({
              title: `Only ${getTotalStock} items available in stock`,
              variant: "destructive",
            });
            return;
          }
        }
      }
    }

    dispatch(
      updateCartQuantity({
        userId: user?.id,
        productId: getCartItem?.productId,
        quantity:
          typeOfAction === "plus"
            ? getCartItem?.quantity + 1
            : getCartItem?.quantity - 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Cart item is updated successfully",
        });
      } else {
        toast({
          title: "Failed to update cart item",
          variant: "destructive",
        });
      }
    });
  }

  function handleCartItemDelete(getCartItem) {
    dispatch(
      deleteCartItem({ userId: user?.id, productId: getCartItem?.productId })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Cart item is deleted successfully",
        });
      }
    });
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border-b border-gray-200">
      <img
        src={cartItem?.image}
        alt={cartItem?.title}
        className="w-24 h-24 sm:w-20 sm:h-20 rounded object-cover border border-gray-200"
      />
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-base text-black truncate">{cartItem?.title}</h3>
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            {cartItem?.productType && (
              <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-800">
                {formatProductType(cartItem.productType)}
              </span>
            )}
            {cartItem?.size && (
              <span className="bg-gray-50 px-2 py-0.5 rounded text-gray-800">
                {cartItem?.category === "kids" ? "Age Group" : "Size"}: {cartItem?.size}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="h-8 w-8 rounded-full"
                size="icon"
                disabled={cartItem?.quantity === 1}
                onClick={() => handleUpdateQuantity(cartItem, "minus")}
              >
                <Minus className="w-4 h-4" />
                <span className="sr-only">Decrease</span>
              </Button>
              <span className="font-semibold text-black">{cartItem?.quantity}</span>
              <Button
                variant="outline"
                className="h-8 w-8 rounded-full"
                size="icon"
                onClick={() => handleUpdateQuantity(cartItem, "plus")}
              >
                <Plus className="w-4 h-4" />
                <span className="sr-only">Increase</span>
              </Button>
            </div>
            <Trash
              onClick={() => handleCartItemDelete(cartItem)}
              className="cursor-pointer text-gray-600 hover:text-black sm:hidden"
              size={18}
            />
          </div>
        </div>
      </div>
      <div className="hidden sm:flex flex-col items-end gap-2 ml-auto">
        <div className="text-right">
          <p className="font-semibold text-black">
            ₹{((cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) * cartItem?.quantity).toFixed(2)}
          </p>
          <p className="text-sm text-gray-600">
            ₹{(cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price).toFixed(2)} each
          </p>
        </div>
        <Trash
          onClick={() => handleCartItemDelete(cartItem)}
          className="cursor-pointer text-gray-600 hover:text-black"
          size={18}
        />
      </div>
      <div className="sm:hidden w-full">
        <div className="flex items-center justify-between mt-2">
          <div>
            <p className="font-semibold text-black">
              ₹{((cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) * cartItem?.quantity).toFixed(2)}
            </p>
            <p className="text-sm text-gray-600">
              ₹{(cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price).toFixed(2)} each
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserCartItemsContent;
