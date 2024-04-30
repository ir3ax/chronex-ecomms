package binding

type GetAllFreebiesRequestById struct {
	FreebiesId string `json:"freebiesId" binding:"required"`
}
