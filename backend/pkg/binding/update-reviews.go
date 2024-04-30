package binding

type UpdateReviewsRequest struct {
	ReviewsId         string `json:"reviewsId"`
	ProductId         string `json:"productId"`
	ReviewsName       string `json:"reviewsName"`
	ReviewsSubject    string `json:"reviewsSubject"`
	ReviewsMessage    string `json:"reviewsMessage"`
	ReviewsStarRating int64  `json:"reviewsStarRating"`
}
