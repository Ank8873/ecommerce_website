import { useState } from "react";
import CommonForm from "../common/form";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "@/store/admin/order-slice";
import { useToast } from "../ui/use-toast";

const initialFormData = {
  status: "",
};

function AdminOrderDetailsView({ orderDetails }) {
  const [formData, setFormData] = useState(initialFormData);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { toast } = useToast();

  console.log(orderDetails, "orderDetails");

  const formatProductType = (type) => {
    if (!type) return "";
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  function handleUpdateStatus(event) {
    event.preventDefault();
    const { status } = formData;

    dispatch(
      updateOrderStatus({ id: orderDetails?._id, orderStatus: status })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getOrderDetailsForAdmin(orderDetails?._id));
        dispatch(getAllOrdersForAdmin());
        setFormData(initialFormData);
        toast({
          title: data?.payload?.message,
        });
      }
    });
  }

  return (
    <DialogContent className="max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Order Details</DialogTitle>
        <DialogDescription>
          Order ID: {orderDetails?._id}
        </DialogDescription>
      </DialogHeader>
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
                      <div className="flex items-start gap-4">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-20 h-20 object-cover rounded-md"
                        />
                        <div className="flex-1 grid gap-1">
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium text-lg">{item.title}</h3>
                            <Badge variant="secondary">
                              {item.category}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
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
                            {item.measurement && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">Measurement:</span>
                                <span>{item.measurement}</span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span className="text-gray-600">Quantity:</span>
                              <span>{item.quantity}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Price/Item:</span>
                              <span>₹{item.price}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Total:</span>
                              <span className="font-medium">₹{item.price * item.quantity}</span>
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
            <div className="font-medium">User Info</div>
            <div className="grid gap-1">
              <div className="flex justify-between">
                <span className="font-medium">Name:</span>
                <span>{orderDetails?.userId?.userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Email:</span>
                <span>{orderDetails?.userId?.email}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Shipping Info</div>
            <div className="grid gap-0.5 text-muted-foreground">
              <span>{orderDetails?.addressInfo?.address}</span>
              <span>{orderDetails?.addressInfo?.city}</span>
              <span>{orderDetails?.addressInfo?.pincode}</span>
              <span>{orderDetails?.addressInfo?.phone}</span>
              <span>{orderDetails?.addressInfo?.notes}</span>
            </div>
          </div>
        </div>

        <div>
          <CommonForm
            formControls={[
              {
                label: "Order Status",
                name: "status",
                componentType: "select",
                options: [
                  { id: "orderPlaced", label: "Order Placed" },
                  { id: "inShipping", label: "In Shipping" },
                  { id: "delivered", label: "Order Delivered" },
                  { id: "rejected", label: "Rejected" },
                  { id: "canceled", label: "Order Canceled" },
                ],
              },
            ]}
            formData={formData}
            setFormData={setFormData}
            buttonText={"Update Order Status"}
            onSubmit={handleUpdateStatus}
          />
        </div>
      </div>
    </DialogContent>
  );
}

export default AdminOrderDetailsView;
