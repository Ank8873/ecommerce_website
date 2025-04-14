import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import ShoppingOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersByUserId,
  getOrderDetails,
  resetOrderDetails,
  cancelOrder
} from "@/store/shop/order-slice";
import { Badge } from "../ui/badge";
import { useToast } from "../ui/use-toast";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

function ShoppingOrders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails, isLoading } = useSelector((state) => state.shopOrder);
  const { toast } = useToast();

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetails(getId));
  }

  function handleCancelOrder(orderId) {
    dispatch(cancelOrder({ orderId, userId: user.id, cancellationReason })).then((result) => {
      if (result.payload?.success) {
        toast({
          title: "Order Cancelled",
          description: "Your order has been cancelled successfully.",
        });
        setOpenCancelDialog(false);
        setCancellationReason("");
      } else {
        toast({
          title: "Error",
          description: result.payload?.message || "Failed to cancel order. Please try again.",
          variant: "destructive",
        });
      }
    });
  }

  function openCancelOrderDialog(orderId) {
    setSelectedOrderId(orderId);
    setOpenCancelDialog(true);
  }

  useEffect(() => {
    dispatch(getAllOrdersByUserId(user?.id));
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList?.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order._id}</TableCell>
                <TableCell>
                  {new Date(order.orderDate).toLocaleString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })}
                </TableCell>
                <TableCell>
                  {new Date(order.orderUpdateDate).toLocaleString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })}
                </TableCell>
                <TableCell>
                  <Badge
                    className={`${
                      order.orderStatus === "orderPlaced"
                        ? "bg-blue-500"
                        : order.orderStatus === "inShipping"
                        ? "bg-yellow-500"
                        : order.orderStatus === "delivered"
                        ? "bg-green-500"
                        : order.orderStatus === "rejected"
                        ? "bg-red-600"
                        : order.orderStatus === "canceled"
                        ? "bg-gray-500"
                        : "bg-black"
                    }`}
                  >
                    {order.orderStatus}
                  </Badge>
                </TableCell>
                <TableCell>₹{order.totalAmount}</TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleFetchOrderDetails(order._id)}
                  >
                    View Details
                  </Button>
                  {order.orderStatus === "orderPlaced" && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => openCancelOrderDialog(order._id)}
                      disabled={isLoading}
                    >
                      Cancel Order
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={openDetailsDialog} onOpenChange={setOpenDetailsDialog}>
          <ShoppingOrderDetailsView
            orderDetails={orderDetails}
            onClose={() => {
              setOpenDetailsDialog(false);
              dispatch(resetOrderDetails());
            }}
          />
        </Dialog>

        <Dialog open={openCancelDialog} onOpenChange={setOpenCancelDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel Order</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="reason">Please provide a reason for cancellation</Label>
                <Input
                  id="reason"
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  placeholder="Enter your reason for cancellation"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setOpenCancelDialog(false);
                  setCancellationReason("");
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleCancelOrder(selectedOrderId)}
                disabled={!cancellationReason.trim() || isLoading}
              >
                Confirm Cancellation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

export default ShoppingOrders;
