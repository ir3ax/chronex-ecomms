package binding

type UpdateFreebiesStatusRequest struct {
	FreebiesId     string `json:"freebiesId"`
	FreebiesStatus string `json:"freebiesStatus"`
}
