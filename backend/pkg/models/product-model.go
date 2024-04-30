package models

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ProductData struct {
	ProductId        uuid.UUID       `gorm:"type:uuid;primaryKey;default:uuid_generate_v4()"`
	ProductName      string          `gorm:"type:text"`
	Img              json.RawMessage `gorm:"type:jsonb"`
	Discount         float64         `gorm:"type:decimal(10, 2);"`
	SupplierPrice    float64         `gorm:"type:decimal(10, 2);"`
	OriginalPrice    float64         `gorm:"type:decimal(10, 2);"`
	DiscountedPrice  float64         `gorm:"type:decimal(10, 2);"`
	Description1     string          `gorm:"type:text"`
	Description2     json.RawMessage `gorm:"type:jsonb"`
	OriginalQuantity float64         `gorm:"type:decimal(10, 2);"`
	CurrentQuantity  float64         `gorm:"type:decimal(10, 2);"`
	ProductStatus    string          `gorm:"type:text"`
	ProductSold      float64         `gorm:"type:decimal(10, 2);"`
	ProductFreebies  json.RawMessage `gorm:"type:jsonb"`
	CreatedBy        uuid.UUID       `gorm:"type:uuid"`
	CreatedAt        time.Time       `gorm:"type:timestamptz;autoCreateTime"`
	UpdatedBy        uuid.UUID       `gorm:"type:uuid"`
	UpdatedAt        time.Time       `gorm:"type:timestamptz;autoUpdateTime"`
	DeletedAt        gorm.DeletedAt  `gorm:"softDelete: true"`
}

func (ProductData) TableName() string {
	return "chronex_product_data"
}

func (p ProductData) GetProductId() uuid.UUID {
	if p.ProductId == uuid.Nil {
		return uuid.UUID{}
	}
	return p.ProductId
}

func (p ProductData) GetProductName() string {
	if p.ProductName == "" {
		return ""
	}

	return p.ProductName
}

func (p ProductData) GetImg() json.RawMessage {
	return p.Img
}

func (p ProductData) GetDiscount() float64 {
	if p.Discount == 0 {
		p.Discount = 0
	}

	return p.Discount
}

func (p ProductData) GetSupplierPrice() float64 {
	if p.SupplierPrice == 0 {
		p.SupplierPrice = 0
	}

	return p.SupplierPrice
}

func (p ProductData) GetOriginalPrice() float64 {
	if p.OriginalPrice == 0 {
		p.OriginalPrice = 0
	}

	return p.OriginalPrice
}

func (p ProductData) GetDiscountedPrice() float64 {
	if p.DiscountedPrice == 0 {
		p.DiscountedPrice = 0
	}

	return p.DiscountedPrice
}

func (p ProductData) GetDescription1() string {
	if p.Description1 == "" {
		return ""
	}

	return p.Description1
}

func (p ProductData) GetDescription2() json.RawMessage {
	return p.Description2
}

func (p ProductData) GetOriginalQuantity() float64 {
	if p.OriginalQuantity == 0 {
		p.OriginalQuantity = 0
	}

	return p.OriginalQuantity
}

func (p ProductData) GetCurrentQuantity() float64 {
	if p.CurrentQuantity == 0 {
		p.CurrentQuantity = 0
	}

	return p.CurrentQuantity
}

func (p ProductData) GetProductStatus() string {
	if p.ProductStatus == "" {
		return ""
	}

	return p.ProductStatus
}

func (p ProductData) GetProductSold() float64 {
	if p.ProductSold == 0 {
		p.ProductSold = 0
	}

	return p.ProductSold
}

func (p ProductData) GetProductFreebies() json.RawMessage {
	return p.ProductFreebies
}
