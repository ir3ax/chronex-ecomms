package binding

type UpdateProductStatusRequest struct {
	ProductId     string `json:"productId"`
	ProductStatus string `json:"productStatus"`
}
