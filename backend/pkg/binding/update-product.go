package binding

type UpdateProductRequest struct {
	ProductId       string  `json:"productId"`
	ProductName     string  `json:"productName"`
	Img             string  `json:"img"`
	Discount        float64 `json:"discount"`
	SupplierPrice   float64 `json:"supplierPrice"`
	OriginalPrice   float64 `json:"originalPrice"`
	DiscountedPrice float64 `json:"discountedPrice"`
	Description1    string  `json:"description1"`
	Description2    string  `json:"description2"`
	ProductStatus   string  `json:"productStatus"`
	ProductSold     float64 `json:"productSold"`
	ProductFreebies string  `json:"productFreebies"`
}
