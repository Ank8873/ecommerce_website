import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { categoryOptionsMap, productTypeMap } from "@/config";
import { Badge } from "../ui/badge";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  return (
    <Card className="w-full max-w-sm mx-auto transition-all duration-300 hover:ring-2 hover:ring-neutral-200 hover:shadow-lg">
      <div 
        onClick={() => handleGetProductDetails(product?._id)}
        className="cursor-pointer"
      >
        <div className="relative overflow-hidden group">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[300px] object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105"
          />
          {product?.totalStock === 0 ? (
            <Badge className="absolute top-2 left-2 bg-neutral-700 hover:bg-neutral-800">
              Out Of Stock
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="absolute top-2 left-2 bg-amber-600 hover:bg-amber-700">
              {`Only ${product?.totalStock} items left`}
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute top-2 left-2 bg-neutral-700 hover:bg-neutral-800">
              Sale
            </Badge>
          ) : null}
        </div>
        <CardContent className="p-4">
          <h2 className="text-xl font-medium mb-2 text-neutral-800">{product?.title}</h2>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[16px] text-neutral-600">
              {categoryOptionsMap[product?.category]}
            </span>
            <span className="text-[14px] text-neutral-500">
              Size: {product?.size}
            </span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[14px] text-neutral-600">
              {productTypeMap[product?.productType]}
            </span>
            <span
              className={`${
                product?.salePrice > 0 ? "line-through text-neutral-400" : "text-neutral-800"
              } text-lg font-semibold`}
            >
              ₹{product?.price}
            </span>
            {product?.salePrice > 0 ? (
              <span className="text-lg font-semibold text-neutral-800">
                ₹{product?.salePrice}
              </span>
            ) : null}
          </div>
        </CardContent>
      </div>
      <CardFooter>
        {product?.totalStock === 0 ? (
          <Button className="w-full bg-neutral-200 hover:bg-neutral-300 text-neutral-600 cursor-not-allowed">
            Out Of Stock
          </Button>
        ) : (
          <Button
            onClick={() => handleAddtoCart(product, product?.totalStock)}
            className="w-full bg-neutral-800 hover:bg-neutral-900 transition-colors"
          >
            Add to cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;
