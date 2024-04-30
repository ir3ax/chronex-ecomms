package binding

type GetAllProductRequestById struct {
	ProductId string `json:"productId" binding:"required"`
}
