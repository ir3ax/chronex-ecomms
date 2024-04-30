package binding

type UpdateFreebiesQuantityRequest struct {
	FreebiesId               string  `json:"freebiesId"`
	FreebiesOriginalQuantity float64 `json:"freebiesOriginalQuantity"`
	FreebiesCurrentQuantity  float64 `json:"freebiesCurrentQuantity"`
}
