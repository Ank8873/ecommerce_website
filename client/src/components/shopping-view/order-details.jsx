import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

function ShoppingOrderDetailsView({ orderDetails }) {
  const { user } = useSelector((state) => state.auth);

  const formatProductType = (type) => {
    if (!type) return "";
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
      <div className="grid gap-6">
        <div className="grid gap-2">
          <div className="flex mt-6 items-center justify-between">
            <p className="font-medium">Order ID</p>
            <Label>{orderDetails?._id}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Date</p>
            <Label>{orderDetails?.orderDate.split("T")[0]}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Price</p>
            <Label>₹{orderDetails?.totalAmount}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment method</p>
            <Label>{orderDetails?.paymentMethod}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment Status</p>
            <Label>{orderDetails?.paymentStatus}</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Status</p>
            <Label>
              <Badge
                className={`py-1 px-3 ${
                  orderDetails?.orderStatus === "orderPlaced"
                    ? "bg-blue-500"
                    : orderDetails?.orderStatus === "inShipping"
                    ? "bg-yellow-500"
                    : orderDetails?.orderStatus === "delivered"
                    ? "bg-green-500"
                    : orderDetails?.orderStatus === "rejected"
                    ? "bg-red-600"
                    : orderDetails?.orderStatus === "canceled"
                    ? "bg-gray-500"
                    : "bg-black"
                }`}
              >
                {orderDetails?.orderStatus}
              </Badge>
            </Label>
          </div>
          {orderDetails?.orderStatus === "canceled" && orderDetails?.cancellationReason && (
            <div className="flex mt-2 items-center justify-between">
              <p className="font-medium">Cancellation Reason</p>
              <Label className="text-red-600">{orderDetails.cancellationReason}</Label>
            </div>
          )}
        </div>
        <Separator />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Order Details</div>
            <div className="space-y-4">
              {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
                ? orderDetails?.cartItems.map((item, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex flex-col sm:flex-row items-start gap-4">
                        <div className="w-full sm:w-auto flex justify-center sm:block">
                          <img 
                            src={item.image} 
                            alt={item.title}
                            className="w-32 sm:w-20 h-32 sm:h-20 object-cover rounded-md"
                          />
                        </div>
                        <div className="flex-1 grid gap-2 w-full">
                          <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                            <h3 className="font-medium text-lg">{item.title}</h3>
                            <Badge variant="secondary" className="whitespace-nowrap">
                              {item.category}
                            </Badge>
                          </div>
                          <div className="grid sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Type:</span>
                              <span>{formatProductType(item.productType)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                {item.category === "kids" ? "Age Group" : "Size"}:
                              </span>
                              <span>{item.size}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Quantity:</span>
                              <span>{item.quantity}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Price/Item:</span>
                              <span>₹{item.price}</span>
                            </div>
                            <div className="flex justify-between sm:col-span-2 pt-2 border-t">
                              <span className="text-gray-600 font-medium">Total:</span>
                              <span className="font-medium text-primary">₹{item.price * item.quantity}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                : <p className="text-gray-500">No items in this order</p>}
            </div>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Shipping Info</div>
            <div className="grid gap-0.5 text-muted-foreground">
              <span>{user.userName}</span>
              <span>{orderDetails?.addressInfo?.address}</span>
              <span>{orderDetails?.addressInfo?.city}</span>
              <span>{orderDetails?.addressInfo?.pincode}</span>
              <span>{orderDetails?.addressInfo?.phone}</span>
              <span>{orderDetails?.addressInfo?.notes}</span>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

export default ShoppingOrderDetailsView;
