package binding

import "encoding/json"

type SaveProductRequest struct {
	ProductName      string          `json:"productName" binding:"required"`
	Img              json.RawMessage `json:"img"`
	Discount         float64         `json:"discount"`
	SupplierPrice    float64         `json:"supplierPrice" binding:"required"`
	OriginalPrice    float64         `json:"originalPrice" binding:"required"`
	DiscountedPrice  float64         `json:"discountedPrice" binding:"required"`
	Description1     string          `json:"description1"`
	Description2     json.RawMessage `json:"description2"`
	OriginalQuantity float64         `json:"originalQuantity" binding:"required"`
	CurrentQuantity  float64         `json:"currentQuantity" binding:"required"`
	ProductSold      float64         `json:"productSold" binding:"required"`
	ProductFreebies  json.RawMessage `json:"productFreebies"`
	ProductStatus    string          `json:"productStatus"`
}
