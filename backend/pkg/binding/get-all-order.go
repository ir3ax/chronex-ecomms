package binding

type GetAllOrderRequest struct {
	Search            string `json:"search"`
	SortOptionProduct string `json:"sortOptionProduct"`
	OrderStatus       string `json:"orderStatus"`
}
