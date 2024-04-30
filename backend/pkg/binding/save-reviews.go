package binding

type SaveReviewsRequest struct {
	ProductId         string `json:"productId" binding:"required"`
	ReviewsName       string `json:"reviewsName"`
	ReviewsSubject    string `json:"reviewsSubject"`
	ReviewsMessage    string `json:"reviewsMessage"`
	ReviewsStarRating int64  `json:"reviewsStarRating"`
}
