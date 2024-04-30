package binding

type UpdateReviewsStatusRequest struct {
	ReviewsId     string `json:"reviewsId"`
	ReviewsStatus string `json:"reviewsStatus"`
}
