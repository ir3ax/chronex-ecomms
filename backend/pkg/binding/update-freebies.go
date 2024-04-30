package binding

type UpdateFreebiesRequest struct {
	FreebiesId         string  `json:"freebiesId"`
	FreebiesName       string  `json:"freebiesName"`
	FreebiesImg        []byte  `json:"freebiesImg"`
	FreebiesStorePrice float64 `json:"freebiesStorePrice"`
	FreebiesStatus     string  `json:"freebiesStatus"`
}
