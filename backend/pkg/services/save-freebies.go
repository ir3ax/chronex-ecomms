package services

import (
	"api/pkg/models"
	"api/pkg/pb"
	"context"
	"errors"
	"fmt"
	"log"
	"strings"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"gorm.io/gorm"
	// "github.com/aws/aws-sdk-go-v2/config"
	// "github.com/aws/aws-sdk-go-v2/feature/s3/manager"
	// "github.com/aws/aws-sdk-go-v2/service/s3"
	// "github.com/aws/aws-sdk-go/aws"
)

func (s *ChronexAdminService) SaveFreebies(ctx context.Context, req *pb.SaveFreebiesRequest) (*pb.SaveFreebiesResponse, error) {

	// Create a new FreebiesData instance
	freebiesData := models.FreebiesData{
		FreebiesName:             req.FreebiesName,
		FreebiesImg:              req.FreebiesImg,
		FreebiesStorePrice:       req.FreebiesStorePrice,
		FreebiesOriginalQuantity: req.FreebiesOriginalQuantity,
		FreebiesCurrentQuantity:  req.FreebiesCurrentQuantity,
		FreebiesStatus:           req.FreebiesStatus,
	}

	// Save the data to the database using GORM
	if err := s.DB.Create(&freebiesData).Error; err != nil {
		log.Printf("Error saving Freebies data: %v", err)
		return nil, err
	}

	// Create and return the response
	response := &pb.SaveFreebiesResponse{
		FreebiesData: &pb.FreebiesData{
			FreebiesName:             freebiesData.FreebiesName,
			FreebiesImg:              freebiesData.FreebiesImg,
			FreebiesStorePrice:       freebiesData.FreebiesStorePrice,
			FreebiesOriginalQuantity: freebiesData.FreebiesOriginalQuantity,
			FreebiesCurrentQuantity:  freebiesData.FreebiesCurrentQuantity,
			FreebiesStatus:           freebiesData.FreebiesStatus,
			CreatedBy:                freebiesData.CreatedBy.String(),
			CreatedAt:                freebiesData.CreatedAt.Unix(),
			UpdatedBy:                freebiesData.UpdatedBy.String(),
			UpdatedAt:                freebiesData.UpdatedAt.Unix(),
		},
	}

	return response, nil
}

func convertSortOption(sortOptionStr string) pb.SortOption {
	switch strings.ToUpper(sortOptionStr) {
	case "ATOZ":
		return pb.SortOption_ATOZ
	case "ZTOA":
		return pb.SortOption_ZTOA
	case "PRICE_HIGH_TO_LOW":
		return pb.SortOption_PRICE_HIGH_TO_LOW
	case "PRICE_LOW_TO_HIGH":
		return pb.SortOption_PRICE_LOW_TO_HIGH
	case "QUANTITY_HIGH_TO_LOW":
		return pb.SortOption_QUANTITY_HIGH_TO_LOW
	case "QUANTITY_LOW_TO_HIGH":
		return pb.SortOption_QUANTITY_LOW_TO_HIGH
	default:
		// Return a default sort option here if needed
		return pb.SortOption_ATOZ // Defaulting to A to Z sorting
	}
}

func (s *ChronexAdminService) GetAllFreebies(ctx context.Context, req *pb.GetAllFreebiesRequest) (*pb.GetAllFreebiesResponse, error) {
	response := &pb.GetAllFreebiesResponse{
		FreebiesData: []*pb.FreebiesData{},
	}

	// Build your query based on the request parameters
	query := s.DB.Model(&models.FreebiesData{})

	// Convert sort option string to enum value
	sortOption := convertSortOption(req.SortOption)

	// Handle sorting
	switch sortOption {
	case pb.SortOption_ATOZ:
		query = query.Order("freebies_name ASC")
	case pb.SortOption_ZTOA:
		query = query.Order("freebies_name DESC")
	case pb.SortOption_PRICE_HIGH_TO_LOW:
		query = query.Order("freebies_store_price DESC")
	case pb.SortOption_PRICE_LOW_TO_HIGH:
		query = query.Order("freebies_store_price ASC")
	case pb.SortOption_QUANTITY_HIGH_TO_LOW:
		query = query.Order("freebies_current_quantity DESC")
	case pb.SortOption_QUANTITY_LOW_TO_HIGH:
		query = query.Order("freebies_current_quantity ASC")
	}

	// Handle searching
	if req.Search != "" {
		query = query.Where("freebies_name ILIKE ?", "%"+req.Search+"%")
	}

	// Filter by active status
	query = query.Where("freebies_status != ?", "DEL")

	// Execute the query
	var freebiesDataValue []models.FreebiesData
	if err := query.Find(&freebiesDataValue).Error; err != nil {
		return nil, status.Error(codes.Internal, fmt.Sprintf("Failed to fetch freebies data: %v", err))
	}

	// Map the retrieved data to protobuf message
	for _, data := range freebiesDataValue {
		response.FreebiesData = append(response.FreebiesData, &pb.FreebiesData{
			FreebiesId:               data.FreebiesId.String(),
			FreebiesName:             data.FreebiesName,
			FreebiesImg:              data.FreebiesImg,
			FreebiesStorePrice:       data.FreebiesStorePrice,
			FreebiesOriginalQuantity: data.FreebiesOriginalQuantity,
			FreebiesCurrentQuantity:  data.FreebiesCurrentQuantity,
			FreebiesStatus:           data.FreebiesStatus,
			CreatedBy:                data.CreatedBy.String(),
			CreatedAt:                data.CreatedAt.Unix(),
			UpdatedBy:                data.UpdatedBy.String(),
			UpdatedAt:                data.UpdatedAt.Unix(),
		})
	}

	return response, nil
}

func (s *ChronexAdminService) GetAllFreebiesDropdown(ctx context.Context, req *pb.GetAllFreebiesDropdownRequest) (*pb.GetAllFreebiesDropdownResponse, error) {
	response := &pb.GetAllFreebiesDropdownResponse{
		FreebiesData: []*pb.FreebiesData{},
	}

	// Build your query based on the request parameters
	query := s.DB.Model(&models.FreebiesData{})

	// Filter by active status
	query = query.Where("freebies_status = ?", "ACT")

	// Execute the query
	var freebiesDataValue []models.FreebiesData
	if err := query.Find(&freebiesDataValue).Error; err != nil {
		return nil, status.Error(codes.Internal, fmt.Sprintf("Failed to fetch freebies data: %v", err))
	}

	// Map the retrieved data to protobuf message
	for _, data := range freebiesDataValue {
		response.FreebiesData = append(response.FreebiesData, &pb.FreebiesData{
			FreebiesId:               data.FreebiesId.String(),
			FreebiesName:             data.FreebiesName,
			FreebiesImg:              data.FreebiesImg,
			FreebiesStorePrice:       data.FreebiesStorePrice,
			FreebiesOriginalQuantity: data.FreebiesOriginalQuantity,
			FreebiesCurrentQuantity:  data.FreebiesCurrentQuantity,
			FreebiesStatus:           data.FreebiesStatus,
			CreatedBy:                data.CreatedBy.String(),
			CreatedAt:                data.CreatedAt.Unix(),
			UpdatedBy:                data.UpdatedBy.String(),
			UpdatedAt:                data.UpdatedAt.Unix(),
		})
	}

	return response, nil
}

func (s *ChronexAdminService) GetAllFreebiesById(ctx context.Context, req *pb.GetAllFreebiesRequestById) (*pb.GetAllFreebiesResponseById, error) {
	response := &pb.GetAllFreebiesResponseById{
		FreebiesData: []*pb.FreebiesData{},
	}

	// Fetch the freebie by its ID and status
	var freebie models.FreebiesData
	if err := s.DB.Where("freebies_id = ? AND freebies_status != ?", req.FreebiesId, "DEL").Find(&freebie).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, status.Error(codes.NotFound, fmt.Sprintf("Freebies with ID %s not found", req.FreebiesId))
		}
		return nil, status.Error(codes.Internal, fmt.Sprintf("Failed to fetch freebies data: %v", err))
	}

	// Map the fetched freebie to protobuf message
	response.FreebiesData = append(response.FreebiesData, &pb.FreebiesData{
		FreebiesId:               freebie.FreebiesId.String(),
		FreebiesName:             freebie.FreebiesName,
		FreebiesImg:              freebie.FreebiesImg,
		FreebiesStorePrice:       freebie.FreebiesStorePrice,
		FreebiesOriginalQuantity: freebie.FreebiesOriginalQuantity,
		FreebiesCurrentQuantity:  freebie.FreebiesCurrentQuantity,
		FreebiesStatus:           freebie.FreebiesStatus,
		CreatedBy:                freebie.CreatedBy.String(),
		CreatedAt:                freebie.CreatedAt.Unix(),
		UpdatedBy:                freebie.UpdatedBy.String(),
		UpdatedAt:                freebie.UpdatedAt.Unix(),
	})

	return response, nil
}

func (s *ChronexAdminService) UpdateFreebies(ctx context.Context, req *pb.UpdateFreebiesRequest) (*pb.UpdateFreebiesResponse, error) {
	// Retrieve existing FreebiesData from the database
	var existingFreebiesData models.FreebiesData
	if err := s.DB.First(&existingFreebiesData, "freebies_id = ?", req.GetFreebiesId()).First(&existingFreebiesData).Error; err != nil {
		log.Printf("Error retrieving Freebies data: %v", err)
		return nil, err
	}

	// Update the existing FreebiesData with new values if they are not nil
	if req.FreebiesName != "" {
		existingFreebiesData.FreebiesName = req.FreebiesName
	}
	if req.FreebiesImg != nil {
		existingFreebiesData.FreebiesImg = req.FreebiesImg
	}
	if req.FreebiesStorePrice != 0 {
		existingFreebiesData.FreebiesStorePrice = req.FreebiesStorePrice
	}
	if req.FreebiesStatus != "" {
		existingFreebiesData.FreebiesStatus = req.FreebiesStatus
	}

	// Save the updated data back to the database using GORM
	if err := s.DB.Save(&existingFreebiesData).Error; err != nil {
		log.Printf("Error updating Freebies data: %v", err)
		return nil, err
	}

	// Create and return the response
	response := &pb.UpdateFreebiesResponse{
		FreebiesData: &pb.FreebiesData{
			FreebiesId:               existingFreebiesData.GetFreebiesId().String(),
			FreebiesName:             existingFreebiesData.GetFreebiesName(),
			FreebiesImg:              []byte(existingFreebiesData.GetFreebiesImg()),
			FreebiesStorePrice:       existingFreebiesData.GetFreebiesStorePrice(),
			FreebiesOriginalQuantity: existingFreebiesData.GetFreebiesOriginalQuantity(),
			FreebiesCurrentQuantity:  existingFreebiesData.GetFreebiesCurrentQuantity(),
			FreebiesStatus:           existingFreebiesData.GetFreebiesStatus(),
			CreatedBy:                existingFreebiesData.CreatedBy.String(),
			CreatedAt:                existingFreebiesData.CreatedAt.Unix(),
			UpdatedBy:                existingFreebiesData.UpdatedBy.String(),
			UpdatedAt:                existingFreebiesData.UpdatedAt.Unix(),
		},
	}

	return response, nil
}

func (s *ChronexAdminService) UpdateFreebiesQuantity(ctx context.Context, req *pb.UpdateFreebiesQuantityRequest) (*pb.UpdateFreebiesQuantityResponse, error) {
	// Retrieve existing FreebiesData from the database
	var existingFreebiesData models.FreebiesData
	if err := s.DB.First(&existingFreebiesData, "freebies_id = ?", req.GetFreebiesId()).First(&existingFreebiesData).Error; err != nil {
		log.Printf("Error retrieving Freebies data: %v", err)
		return nil, err
	}

	// Update the existing FreebiesData with new values if they are not nil
	if req.FreebiesOriginalQuantity != 0 {
		existingFreebiesData.FreebiesOriginalQuantity = req.FreebiesOriginalQuantity
	}
	if req.FreebiesCurrentQuantity != 0 {
		existingFreebiesData.FreebiesCurrentQuantity = req.FreebiesCurrentQuantity
	}

	// Save the updated data back to the database using GORM
	if err := s.DB.Save(&existingFreebiesData).Error; err != nil {
		log.Printf("Error updating Freebies data: %v", err)
		return nil, err
	}

	// Create and return the response
	response := &pb.UpdateFreebiesQuantityResponse{
		FreebiesData: &pb.FreebiesData{
			FreebiesId:               existingFreebiesData.GetFreebiesId().String(),
			FreebiesName:             existingFreebiesData.GetFreebiesName(),
			FreebiesImg:              []byte(existingFreebiesData.GetFreebiesImg()),
			FreebiesStorePrice:       existingFreebiesData.GetFreebiesStorePrice(),
			FreebiesOriginalQuantity: existingFreebiesData.GetFreebiesOriginalQuantity(),
			FreebiesCurrentQuantity:  existingFreebiesData.GetFreebiesCurrentQuantity(),
			FreebiesStatus:           existingFreebiesData.GetFreebiesStatus(),
			CreatedBy:                existingFreebiesData.CreatedBy.String(),
			CreatedAt:                existingFreebiesData.CreatedAt.Unix(),
			UpdatedBy:                existingFreebiesData.UpdatedBy.String(),
			UpdatedAt:                existingFreebiesData.UpdatedAt.Unix(),
		},
	}

	return response, nil
}

func (s *ChronexAdminService) UpdateFreebiesStatus(ctx context.Context, req *pb.UpdateFreebiesStatusRequest) (*pb.UpdateFreebiesStatusResponse, error) {
	// Retrieve existing FreebiesData from the database
	var existingFreebiesData models.FreebiesData
	if err := s.DB.First(&existingFreebiesData, "freebies_id = ?", req.GetFreebiesId()).First(&existingFreebiesData).Error; err != nil {
		log.Printf("Error retrieving Freebies data: %v", err)
		return nil, err
	}

	// Update the existing FreebiesData with new values if they are not nil
	if req.FreebiesStatus != "" {
		existingFreebiesData.FreebiesStatus = req.FreebiesStatus
	}

	// Save the updated data back to the database using GORM
	if err := s.DB.Save(&existingFreebiesData).Error; err != nil {
		log.Printf("Error updating Freebies data: %v", err)
		return nil, err
	}

	// Create and return the response
	response := &pb.UpdateFreebiesStatusResponse{
		FreebiesData: &pb.FreebiesData{
			FreebiesId:               existingFreebiesData.GetFreebiesId().String(),
			FreebiesName:             existingFreebiesData.GetFreebiesName(),
			FreebiesImg:              []byte(existingFreebiesData.GetFreebiesImg()),
			FreebiesStorePrice:       existingFreebiesData.GetFreebiesStorePrice(),
			FreebiesOriginalQuantity: existingFreebiesData.GetFreebiesOriginalQuantity(),
			FreebiesCurrentQuantity:  existingFreebiesData.GetFreebiesCurrentQuantity(),
			FreebiesStatus:           existingFreebiesData.GetFreebiesStatus(),
			CreatedBy:                existingFreebiesData.CreatedBy.String(),
			CreatedAt:                existingFreebiesData.CreatedAt.Unix(),
			UpdatedBy:                existingFreebiesData.UpdatedBy.String(),
			UpdatedAt:                existingFreebiesData.UpdatedAt.Unix(),
		},
	}

	return response, nil
}
