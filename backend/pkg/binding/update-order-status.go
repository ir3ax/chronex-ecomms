package binding

type UpdateOrderStatusRequest struct {
	OrderId     string `json:"orderId"`
	OrderStatus string `json:"orderStatus"`
}
