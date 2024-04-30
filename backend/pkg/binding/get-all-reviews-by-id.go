package binding

type GetAllReviewsRequestById struct {
	ReviewsId string `json:"reviewsId" binding:"required"`
}
