package services

import (
	"api/pkg/models"
	"api/pkg/pb"
	"context"
	"encoding/json"
	"fmt"
	"log"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (s *ChronexAdminService) SaveHomeImages(ctx context.Context, req *pb.SaveHomeImagesRequest) (*pb.SaveHomeImagesResponse, error) {

	images, err := json.Marshal(req.HomeImg)
	if err != nil {
		log.Printf("Error marshaling images: %v", err)
		return nil, err
	}

	// Create a new FreebiesData instance
	homeImagesData := models.HomeImagesData{
		HomeImg: json.RawMessage(images),
	}

	// Save the data to the database using GORM
	if err := s.DB.Create(&homeImagesData).Error; err != nil {
		log.Printf("Error saving Home Images data: %v", err)
		return nil, err
	}

	// Create and return the response
	response := &pb.SaveHomeImagesResponse{
		HomeImagesData: &pb.HomeImagesData{
			HomeImagesId: homeImagesData.HomeImagesId.String(),
			HomeImg:      string(homeImagesData.HomeImg),
			CreatedBy:    homeImagesData.CreatedBy.String(),
			CreatedAt:    homeImagesData.CreatedAt.Unix(),
			UpdatedBy:    homeImagesData.UpdatedBy.String(),
			UpdatedAt:    homeImagesData.UpdatedAt.Unix(),
		},
	}

	return response, nil
}

func (s *ChronexAdminService) GetAllHomeImages(ctx context.Context, req *pb.GetAllHomeImagesRequest) (*pb.GetAllHomeImagesResponse, error) {
	response := &pb.GetAllHomeImagesResponse{
		HomeImagesData: []*pb.HomeImagesData{},
	}

	// Build your query based on the request parameters
	query := s.DB.Model(&models.HomeImagesData{})

	// Execute the query
	var homeImagesDataValue []models.HomeImagesData
	if err := query.Find(&homeImagesDataValue).Error; err != nil {
		return nil, status.Error(codes.Internal, fmt.Sprintf("Failed to fetch home images data: %v", err))
	}

	// Map the retrieved data to protobuf message
	for _, data := range homeImagesDataValue {
		response.HomeImagesData = append(response.HomeImagesData, &pb.HomeImagesData{
			HomeImagesId: data.HomeImagesId.String(),
			HomeImg:      string(data.HomeImg),
			CreatedBy:    data.CreatedBy.String(),
			CreatedAt:    data.CreatedAt.Unix(),
			UpdatedBy:    data.UpdatedBy.String(),
			UpdatedAt:    data.UpdatedAt.Unix(),
		})
	}

	return response, nil
}

func (s *ChronexAdminService) UpdateHomeImages(ctx context.Context, req *pb.UpdateHomeImagesRequest) (*pb.UpdateHomeImagesResponse, error) {
	// Check if req.HomeImg is an empty array
	var newImages []string
	if err := json.Unmarshal([]byte(req.HomeImg), &newImages); err != nil {
		log.Printf("Error unmarshaling new images: %v", err)
		return nil, err
	}

	if len(newImages) == 0 {
		// Delete all data with corresponding homeImagesId
		if err := s.DB.Where("home_images_id = ?", req.GetHomeImagesId()).Delete(&models.HomeImagesData{}).Error; err != nil {
			log.Printf("Error deleting Home Images data: %v", err)
			return nil, err
		}
		// No need to proceed further, return here
		return &pb.UpdateHomeImagesResponse{}, nil
	}

	// Retrieve existing HomeImagesData from the database
	var existingHomeImagesData models.HomeImagesData
	if err := s.DB.First(&existingHomeImagesData, "home_images_id = ?", req.GetHomeImagesId()).Error; err != nil {
		log.Printf("Error retrieving Home Images data: %v", err)
		return nil, err
	}

	// Update the existing HomeImagesData with new values
	images, err := json.Marshal(req.HomeImg)
	if err != nil {
		log.Printf("Error marshaling images: %v", err)
		return nil, err
	}
	existingHomeImagesData.HomeImg = json.RawMessage(images)

	// Save the updated data back to the database using GORM
	if err := s.DB.Save(&existingHomeImagesData).Error; err != nil {
		log.Printf("Error updating Home Images data: %v", err)
		return nil, err
	}

	// Create and return the response
	response := &pb.UpdateHomeImagesResponse{
		HomeImagesData: &pb.HomeImagesData{
			HomeImagesId: existingHomeImagesData.GetHomeImagesId().String(),
			HomeImg:      string(existingHomeImagesData.GetHomeImg()),
			CreatedBy:    existingHomeImagesData.CreatedBy.String(),
			CreatedAt:    existingHomeImagesData.CreatedAt.Unix(),
			UpdatedBy:    existingHomeImagesData.UpdatedBy.String(),
			UpdatedAt:    existingHomeImagesData.UpdatedAt.Unix(),
		},
	}

	return response, nil
}

func (s *ChronexAdminService) DeleteHomeImages(ctx context.Context, req *pb.DeleteHomeImagesRequest) (*pb.DeleteHomeImagesResponse, error) {
	// Retrieve existing HomeImagesData from the database
	var existingHomeImagesData models.HomeImagesData
	if err := s.DB.First(&existingHomeImagesData, "home_images_id = ?", req.GetHomeImagesId()).Error; err != nil {
		log.Printf("Error retrieving Home Images data: %v", err)
		return nil, err
	}

	// Soft delete the home image
	if err := s.DB.Delete(&existingHomeImagesData).Error; err != nil {
		log.Printf("Error deleting Home Images data: %v", err)
		return nil, err
	}

	// Create and return the response
	response := &pb.DeleteHomeImagesResponse{
		HomeImagesData: &pb.HomeImagesData{
			HomeImagesId: existingHomeImagesData.GetHomeImagesId().String(),
			HomeImg:      string(existingHomeImagesData.GetHomeImg()),
			CreatedBy:    existingHomeImagesData.CreatedBy.String(),
			CreatedAt:    existingHomeImagesData.CreatedAt.Unix(),
			UpdatedBy:    existingHomeImagesData.UpdatedBy.String(),
			UpdatedAt:    existingHomeImagesData.UpdatedAt.Unix(),
		},
	}

	return response, nil
}
