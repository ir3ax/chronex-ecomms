package models

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type OrderData struct {
	OrderId         uuid.UUID       `gorm:"type:uuid;primaryKey;default:uuid_generate_v4()"`
	Customer        json.RawMessage `gorm:"type:jsonb"`
	CompleteAddress json.RawMessage `gorm:"type:jsonb"`
	Product         json.RawMessage `gorm:"type:jsonb"`
	Total           float64         `gorm:"type:decimal(10, 2);"`
	OrderStatus     string          `gorm:"type:text"`
	TrackingId      string          `gorm:"type:text"`
	StickyNotes     json.RawMessage `gorm:"type:jsonb"`
	CreatedBy       uuid.UUID       `gorm:"type:uuid"`
	CreatedAt       time.Time       `gorm:"type:timestamptz;autoCreateTime"`
	UpdatedBy       uuid.UUID       `gorm:"type:uuid"`
	UpdatedAt       time.Time       `gorm:"type:timestamptz;autoUpdateTime"`
	DeletedAt       gorm.DeletedAt  `gorm:"softDelete: true"`
}

func (OrderData) TableName() string {
	return "chronex_product_order"
}

func (p OrderData) GetOrderId() uuid.UUID {
	if p.OrderId == uuid.Nil {
		return uuid.UUID{}
	}
	return p.OrderId
}

func (p OrderData) GetCustomer() json.RawMessage {
	return p.Customer
}

func (p OrderData) GetCompleteAddress() json.RawMessage {
	return p.CompleteAddress
}

func (p OrderData) GetProduct() json.RawMessage {
	return p.Product
}

func (p OrderData) GetTotal() float64 {
	if p.Total == 0 {
		p.Total = 0
	}

	return p.Total
}

func (p OrderData) GetOrderStatus() string {
	if p.OrderStatus == "" {
		return ""
	}

	return p.OrderStatus
}

func (p OrderData) GetTrackingId() string {
	if p.TrackingId == "" {
		return ""
	}

	return p.TrackingId
}

func (p OrderData) GetStickyNotes() json.RawMessage {
	return p.StickyNotes
}

// GetTotalSalesPerDayWithStatus retrieves total sales per day for a specific month and order status
func GetTotalSalesPerDayWithStatus(db *gorm.DB, status string, year int, month time.Month) (map[string]float64, error) {
	var results []struct {
		Date  time.Time
		Total float64
	}

	// Filter results by order status and month
	err := db.Model(&OrderData{}).
		Select("DATE(created_at) AS date, SUM(total) AS total").
		Where("order_status = ? AND EXTRACT(YEAR FROM created_at) = ? AND EXTRACT(MONTH FROM created_at) = ?", status, year, month).
		Group("date").
		Find(&results).Error

	if err != nil {
		return nil, err
	}

	totalSalesPerDay := make(map[string]float64)
	for _, result := range results {
		totalSalesPerDay[result.Date.Format("2006-01-02")] = result.Total
	}

	return totalSalesPerDay, nil
}

// GetAllTotalOrder retrieves total order quantity per day for a specific month and order status
func GetAllTotalOrder(db *gorm.DB, status string, year int, month time.Month) (map[string]int, error) {
	var results []struct {
		Date  time.Time
		Count int
	}

	// Filter results by order status and month
	err := db.Model(&OrderData{}).
		Select("DATE(created_at) AS date, COUNT(*) AS count").
		Where("order_status = ? AND EXTRACT(YEAR FROM created_at) = ? AND EXTRACT(MONTH FROM created_at) = ?", status, year, month).
		Group("date").
		Find(&results).Error

	if err != nil {
		return nil, err
	}

	totalOrderQuantityPerDay := make(map[string]int)
	for _, result := range results {
		totalOrderQuantityPerDay[result.Date.Format("2006-01-02")] = result.Count
	}

	return totalOrderQuantityPerDay, nil
}

// BestSellingProduct represents a best selling product
type BestSellingProduct struct {
	ProductID          string  `json:"product_id"`
	ProductName        string  `json:"product_name"`
	TotalSales         float64 `json:"total_sales"`
	TotalOrderQuantity int     `json:"total_order_quantity"`
}

// GetBestSellingProducts retrieves best selling products based on the order data
func GetBestSellingProducts(db *gorm.DB, status string, year int, month time.Month) ([]BestSellingProduct, error) {
	var results []struct {
		ProductID          string
		ProductName        string
		TotalSales         float64
		TotalOrderQuantity int
	}

	// Retrieve best selling products by unnesting the product array and then grouping by product ID and name
	err := db.Raw(`
	WITH products AS (
		SELECT
			order_id,
			(jsonb_array_elements(product)->>'productId')::text AS product_id,
			(jsonb_array_elements(product)->>'productName')::text AS product_name,
			(jsonb_array_elements(product)->>'quantity')::int AS quantity,
			(jsonb_array_elements(product)->>'discountedPrice')::numeric AS discounted_price,
			total
		FROM
			chronex_product_order
		WHERE
			order_status = ? 
			AND EXTRACT(YEAR FROM created_at) = ? 
			AND EXTRACT(MONTH FROM created_at) = ?
		)
		SELECT
			product_id,
			product_name,
			SUM(quantity * discounted_price) AS total_sales,
			SUM(quantity) AS total_order_quantity
		FROM
			products
		GROUP BY
			product_id, product_name
		ORDER BY
			total_sales DESC
	`, status, year, month).Scan(&results).Error

	if err != nil {
		return nil, err
	}

	var bestSellingProducts []BestSellingProduct
	for _, result := range results {
		bestSellingProducts = append(bestSellingProducts, BestSellingProduct{
			ProductID:          result.ProductID,
			ProductName:        result.ProductName,
			TotalSales:         result.TotalSales,
			TotalOrderQuantity: result.TotalOrderQuantity,
		})
	}

	return bestSellingProducts, nil
}
