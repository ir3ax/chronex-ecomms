package binding

import "encoding/json"

type SaveOrderRequest struct {
	Customer        json.RawMessage `json:"customer"`
	CompleteAddress json.RawMessage `json:"completeAddress"`
	Product         json.RawMessage `json:"product"`
	Total           float64         `json:"total"`
	OrderStatus     string          `json:"orderStatus"`
}
