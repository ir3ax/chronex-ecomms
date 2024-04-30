package binding

type UpdateProductQuantityRequest struct {
	ProductId        string  `json:"productId"`
	OriginalQuantity float64 `json:"productOriginalQuantity"`
	CurrentQuantity  float64 `json:"productCurrentQuantity"`
}
