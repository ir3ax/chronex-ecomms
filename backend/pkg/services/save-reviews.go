package services

import (
	"api/pkg/models"
	"api/pkg/pb"
	"context"
	"errors"
	"fmt"
	"log"
	"sort"
	"strings"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"gorm.io/gorm"
)

func (s *ChronexAdminService) SaveReviews(ctx context.Context, req *pb.SaveReviewsRequest) (*pb.SaveReviewsResponse, error) {

	// Create a new FreebiesData instance
	reviewsData := models.ReviewsData{
		ProductId:         req.ProductId,
		ReviewsName:       req.ReviewsName,
		ReviewsSubject:    req.ReviewsSubject,
		ReviewsMessage:    req.ReviewsMessage,
		ReviewsStarRating: req.ReviewsStarRating,
		ReviewsStatus:     "ACT",
	}

	// Save the data to the database using GORM
	if err := s.DB.Create(&reviewsData).Error; err != nil {
		log.Printf("Error saving Reviews data: %v", err)
		return nil, err
	}

	// Create and return the response
	response := &pb.SaveReviewsResponse{
		ReviewsData: &pb.ReviewsData{
			ReviewsId:         reviewsData.ReviewsId.String(),
			ProductId:         reviewsData.ProductId,
			ReviewsName:       reviewsData.ReviewsName,
			ReviewsSubject:    reviewsData.ReviewsSubject,
			ReviewsMessage:    reviewsData.ReviewsMessage,
			ReviewsStarRating: reviewsData.ReviewsStarRating,
			ReviewsStatus:     reviewsData.ReviewsStatus,
			CreatedBy:         reviewsData.CreatedBy.String(),
			CreatedAt:         reviewsData.CreatedAt.Unix(),
			UpdatedBy:         reviewsData.UpdatedBy.String(),
			UpdatedAt:         reviewsData.UpdatedAt.Unix(),
		},
	}

	return response, nil
}

func convertSortOptionReviews(sortOptionStr string) pb.SortOptionReviews {
	switch strings.ToUpper(sortOptionStr) {
	case "ATOZ":
		return pb.SortOptionReviews_REVIEWS_ATOZ
	case "ZTOA":
		return pb.SortOptionReviews_REVIEWS_ZTOA
	case "REVIEWS_RATING_HIGH_TO_LOW":
		return pb.SortOptionReviews_REVIEWS_RATING_HIGH_TO_LOW
	case "REVIEWS_RATING_LOW_TO_HIGH":
		return pb.SortOptionReviews_REVIEWS_RATING_LOW_TO_HIGH
	case "REVIEWS_DATE_HIGH_TO_LOW":
		return pb.SortOptionReviews_REVIEWS_DATE_HIGH_TO_LOW
	case "REVIEWS_DATE_LOW_TO_HIGH":
		return pb.SortOptionReviews_REVIEWS_DATE_LOW_TO_HIGH
	default:
		return pb.SortOptionReviews_REVIEWS_ATOZ
	}
}

func (s *ChronexAdminService) GetAllReviews(ctx context.Context, req *pb.GetAllReviewsRequest) (*pb.GetAllReviewsResponse, error) {
	response := &pb.GetAllReviewsResponse{
		ReviewsData: []*pb.ReviewsData{},
	}

	// Build your query based on the request parameters
	query := s.DB.Model(&models.ReviewsData{})

	// Convert sort option string to enum value
	sortOption := convertSortOptionReviews(req.SortOptionReviews)

	// Handle sorting
	switch sortOption {
	case pb.SortOptionReviews_REVIEWS_ATOZ:
		query = query.Order("reviews_name ASC")
	case pb.SortOptionReviews_REVIEWS_ZTOA:
		query = query.Order("reviews_name DESC")
	case pb.SortOptionReviews_REVIEWS_RATING_HIGH_TO_LOW:
		query = query.Order("reviews_star_rating DESC")
	case pb.SortOptionReviews_REVIEWS_RATING_LOW_TO_HIGH:
		query = query.Order("reviews_star_rating ASC")
	case pb.SortOptionReviews_REVIEWS_DATE_HIGH_TO_LOW:
		query = query.Order("created_at DESC")
	case pb.SortOptionReviews_REVIEWS_DATE_LOW_TO_HIGH:
		query = query.Order("created_at ASC")
	}

	// Handle searching
	if req.Search != "" {
		query = query.Where("reviews_name ILIKE ?", "%"+req.Search+"%")
	}

	// Filter by active status
	query = query.Where("reviews_status != ?", "DEL")

	// Execute the query
	var reviewsDataValue []models.ReviewsData
	if err := query.Find(&reviewsDataValue).Error; err != nil {
		return nil, status.Error(codes.Internal, fmt.Sprintf("Failed to fetch product data: %v", err))
	}

	// Map the retrieved data to protobuf message
	for _, data := range reviewsDataValue {
		response.ReviewsData = append(response.ReviewsData, &pb.ReviewsData{
			ReviewsId:         data.ReviewsId.String(),
			ProductId:         data.ProductId,
			ReviewsName:       data.ReviewsName,
			ReviewsSubject:    data.ReviewsSubject,
			ReviewsMessage:    data.ReviewsMessage,
			ReviewsStarRating: data.ReviewsStarRating,
			ReviewsStatus:     data.ReviewsStatus,
			CreatedBy:         data.CreatedBy.String(),
			CreatedAt:         data.CreatedAt.Unix(),
			UpdatedBy:         data.UpdatedBy.String(),
			UpdatedAt:         data.UpdatedAt.Unix(),
		})
	}

	return response, nil
}

func (s *ChronexAdminService) UpdateReviews(ctx context.Context, req *pb.UpdateReviewsRequest) (*pb.UpdateReviewsResponse, error) {
	// Retrieve existing FreebiesData from the database
	var existingReviewsData models.ReviewsData
	if err := s.DB.First(&existingReviewsData, "reviews_id = ?", req.GetReviewsId()).First(&existingReviewsData).Error; err != nil {
		log.Printf("Error retrieving Reviews data: %v", err)
		return nil, err
	}

	// Update the existing ReviewsData with new values if they are not nil
	if req.ProductId != "" {
		existingReviewsData.ProductId = req.ProductId
	}
	if req.ReviewsName != "" {
		existingReviewsData.ReviewsName = req.ReviewsName
	}
	if req.ReviewsSubject != "" {
		existingReviewsData.ReviewsSubject = req.ReviewsSubject
	}
	if req.ReviewsMessage != "" {
		existingReviewsData.ReviewsMessage = req.ReviewsMessage
	}
	if req.ReviewsStarRating != 0 {
		existingReviewsData.ReviewsStarRating = req.ReviewsStarRating
	}

	// Save the updated data back to the database using GORM
	if err := s.DB.Save(&existingReviewsData).Error; err != nil {
		log.Printf("Error updating Reviews data: %v", err)
		return nil, err
	}

	// Create and return the response
	response := &pb.UpdateReviewsResponse{
		ReviewsData: &pb.ReviewsData{
			ReviewsId:         existingReviewsData.GetReviewsId().String(),
			ProductId:         existingReviewsData.GetProductId(),
			ReviewsName:       existingReviewsData.GetReviewsName(),
			ReviewsSubject:    existingReviewsData.GetReviewsSubject(),
			ReviewsMessage:    existingReviewsData.GetReviewsMessage(),
			ReviewsStarRating: existingReviewsData.GetReviewsStarRating(),
			ReviewsStatus:     existingReviewsData.GetReviewsStatus(),
			CreatedBy:         existingReviewsData.CreatedBy.String(),
			CreatedAt:         existingReviewsData.CreatedAt.Unix(),
			UpdatedBy:         existingReviewsData.UpdatedBy.String(),
			UpdatedAt:         existingReviewsData.UpdatedAt.Unix(),
		},
	}

	return response, nil
}

func (s *ChronexAdminService) UpdateReviewsStatus(ctx context.Context, req *pb.UpdateReviewsStatusRequest) (*pb.UpdateReviewsStatusResponse, error) {
	// Retrieve existing FreebiesData from the database
	var existingReviewsData models.ReviewsData
	if err := s.DB.First(&existingReviewsData, "reviews_id = ?", req.GetReviewsId()).First(&existingReviewsData).Error; err != nil {
		log.Printf("Error retrieving Reviews data: %v", err)
		return nil, err
	}

	// Update the existing FreebiesData with new values if they are not nil
	if req.ReviewsStatus != "" {
		existingReviewsData.ReviewsStatus = req.ReviewsStatus
	}

	// Save the updated data back to the database using GORM
	if err := s.DB.Save(&existingReviewsData).Error; err != nil {
		log.Printf("Error updating Reviews data: %v", err)
		return nil, err
	}

	// Create and return the response
	response := &pb.UpdateReviewsStatusResponse{
		ReviewsData: &pb.ReviewsData{
			ReviewsId:         existingReviewsData.GetReviewsId().String(),
			ProductId:         existingReviewsData.GetProductId(),
			ReviewsName:       existingReviewsData.GetReviewsName(),
			ReviewsSubject:    existingReviewsData.GetReviewsSubject(),
			ReviewsMessage:    existingReviewsData.GetReviewsMessage(),
			ReviewsStarRating: existingReviewsData.GetReviewsStarRating(),
			ReviewsStatus:     existingReviewsData.GetReviewsStatus(),
			CreatedBy:         existingReviewsData.CreatedBy.String(),
			CreatedAt:         existingReviewsData.CreatedAt.Unix(),
			UpdatedBy:         existingReviewsData.UpdatedBy.String(),
			UpdatedAt:         existingReviewsData.UpdatedAt.Unix(),
		},
	}

	return response, nil
}

func (s *ChronexAdminService) GetAllReviewsById(ctx context.Context, req *pb.GetAllReviewsRequestById) (*pb.GetAllReviewsResponseById, error) {
	response := &pb.GetAllReviewsResponseById{
		ReviewsData: []*pb.ReviewsData{},
	}

	// Fetch all reviews for the given product_id and reviews_status
	var reviews []models.ReviewsData
	if err := s.DB.Where("product_id = ? AND reviews_status != ?", req.ReviewsId, "DEL").Find(&reviews).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, status.Error(codes.NotFound, fmt.Sprintf("Reviews with ID %s not found", req.ReviewsId))
		}
		return nil, status.Error(codes.Internal, fmt.Sprintf("Failed to fetch reviews data: %v", err))
	}

	// Sort the reviews slice by created time in descending order
	sort.Slice(reviews, func(i, j int) bool {
		return reviews[i].CreatedAt.After(reviews[j].CreatedAt)
	})

	// Map the fetched reviews to protobuf messages
	for _, review := range reviews {
		response.ReviewsData = append(response.ReviewsData, &pb.ReviewsData{
			ReviewsId:         review.ReviewsId.String(),
			ProductId:         review.ProductId,
			ReviewsName:       review.ReviewsName,
			ReviewsSubject:    review.ReviewsSubject,
			ReviewsMessage:    review.ReviewsMessage,
			ReviewsStarRating: review.ReviewsStarRating,
			ReviewsStatus:     review.ReviewsStatus,
			CreatedBy:         review.CreatedBy.String(),
			CreatedAt:         review.CreatedAt.Unix(),
			UpdatedBy:         review.UpdatedBy.String(),
			UpdatedAt:         review.UpdatedAt.Unix(),
		})
	}

	return response, nil
}
