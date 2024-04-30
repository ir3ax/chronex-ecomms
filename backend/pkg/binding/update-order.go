package binding

import "encoding/json"

type UpdateOrderRequest struct {
	OrderId         string          `json:"orderId"`
	Customer        json.RawMessage `json:"customer"`
	CompleteAddress json.RawMessage `json:"completeAddress"`
	Product         json.RawMessage `json:"product"`
	Total           float64         `json:"total"`
	OrderStatus     string          `json:"orderStatus"`
	TrackingId      string          `json:"trackingId"`
	StickyNotes     string          `json:"stickyNotes"`
}
