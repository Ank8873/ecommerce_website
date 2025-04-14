import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import AdminOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
} from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";

function AdminOrdersView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { orderList, orderDetails } = useSelector((state) => state.adminOrder);
  const dispatch = useDispatch();

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetailsForAdmin(getId));
  }

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  console.log(orderDetails, "orderList");

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Shipping Address</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList?.map((orderItem) => (
              <TableRow key={orderItem._id}>
                <TableCell>{orderItem._id}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{orderItem.userId?.userName || 'N/A'}</span>
                    <span className="text-sm text-muted-foreground">{orderItem.userId?.email || 'N/A'}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col max-w-[200px]">
                    <span>{orderItem.addressInfo?.address}</span>
                    <span>{orderItem.addressInfo?.city}</span>
                    <span>{orderItem.addressInfo?.pincode}</span>
                    <span className="text-sm text-muted-foreground">{orderItem.addressInfo?.phone}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(orderItem.orderDate).toLocaleString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })}
                </TableCell>
                <TableCell>
                  {new Date(orderItem.orderUpdateDate).toLocaleString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })}
                </TableCell>
                <TableCell>₹{orderItem.totalAmount}</TableCell>
                <TableCell>
                  <Badge
                    className={`${
                      orderItem.orderStatus === "orderPlaced"
                        ? "bg-blue-500"
                        : orderItem.orderStatus === "inShipping"
                        ? "bg-yellow-500"
                        : orderItem.orderStatus === "delivered"
                        ? "bg-green-500"
                        : orderItem.orderStatus === "rejected"
                        ? "bg-red-600"
                        : orderItem.orderStatus === "canceled"
                        ? "bg-gray-500"
                        : "bg-black"
                    }`}
                  >
                    {orderItem.orderStatus}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Dialog
                      open={openDetailsDialog}
                      onOpenChange={() => {
                        setOpenDetailsDialog(false);
                        dispatch(resetOrderDetails());
                      }}
                    >
                      <Button
                        onClick={() =>
                          handleFetchOrderDetails(orderItem._id)
                        }
                      >
                        View Details
                      </Button>
                      <AdminOrderDetailsView orderDetails={orderDetails} />
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default AdminOrdersView;
