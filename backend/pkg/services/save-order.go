package services

import (
	"api/pkg/models"
	"api/pkg/pb"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"strings"
	"time"

	"github.com/google/uuid"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (s *ChronexAdminService) SaveOrder(ctx context.Context, req *pb.SaveOrderRequest) (*pb.SaveOrderResponse, error) {

	// Create a new PDFExtractorData instance
	orderData := models.OrderData{
		Customer:        json.RawMessage(req.Customer),
		CompleteAddress: json.RawMessage(req.CompleteAddress),
		Product:         json.RawMessage(req.Product),
		Total:           req.Total,
		OrderStatus:     req.OrderStatus,
	}

	// Save the data to the database using GORM
	if err := s.DB.Create(&orderData).Error; err != nil {
		log.Printf("Error saving Order data: %v", err)
		return nil, err
	}

	// Create and return the response
	response := &pb.SaveOrderResponse{
		OrderData: &pb.OrderData{
			OrderId:         orderData.OrderId.String(),
			Customer:        string(orderData.Customer),
			CompleteAddress: string(orderData.CompleteAddress),
			Product:         string(orderData.Product),
			Total:           orderData.Total,
			OrderStatus:     orderData.OrderStatus,
			TrackingId:      orderData.TrackingId,
			StickyNotes:     string(orderData.StickyNotes),
			CreatedBy:       orderData.CreatedBy.String(),
			CreatedAt:       orderData.CreatedAt.Unix(),
			UpdatedBy:       orderData.UpdatedBy.String(),
			UpdatedAt:       orderData.UpdatedAt.Unix(),
		},
	}

	return response, nil
}

func convertSortOptionOrder(sortOptionStr string) pb.SortOptionOrder {
	switch strings.ToUpper(sortOptionStr) {
	case "ATOZ":
		return pb.SortOptionOrder_ORDER_ATOZ
	case "ZTOA":
		return pb.SortOptionOrder_ORDER_ZTOA
	case "ORDER_DATE_HIGH_TO_LOW":
		return pb.SortOptionOrder_ORDER_DATE_HIGH_TO_LOW
	case "ORDER_DATE_LOW_TO_HIGH":
		return pb.SortOptionOrder_ORDER_DATE_LOW_TO_HIGH
	default:
		return pb.SortOptionOrder_ORDER_ATOZ
	}
}

func (s *ChronexAdminService) GetAllOrder(ctx context.Context, req *pb.GetAllOrderRequest) (*pb.GetAllOrderResponse, error) {
	response := &pb.GetAllOrderResponse{
		OrderData: []*pb.OrderData{},
	}

	// Calculate the timestamp for two months ago
	twoMonthsAgo := time.Now().AddDate(0, -2, 0)

	// Build your query based on the request parameters
	query := s.DB.Model(&models.OrderData{})

	// Convert sort option string to enum value
	sortOption := convertSortOptionOrder(req.SortOptionOrder)

	// Handle sorting
	switch sortOption {
	case pb.SortOptionOrder_ORDER_ATOZ:
		query = query.Order("customer ASC")
	case pb.SortOptionOrder_ORDER_ZTOA:
		query = query.Order("customer DESC")
	case pb.SortOptionOrder_ORDER_DATE_HIGH_TO_LOW:
		query = query.Order("created_at DESC")
	case pb.SortOptionOrder_ORDER_DATE_LOW_TO_HIGH:
		query = query.Order("created_at ASC")
	}

	// Handle searching
	if req.Search != "" {
		searchParam := "%" + strings.ToLower(req.Search) + "%"
		query = query.Where("(lower(customer->>'lastName') ILIKE ? OR "+
			"lower(customer->>'firstName') ILIKE ? OR "+
			"lower(customer->>'emailAddress') ILIKE ? OR "+
			"lower(customer->>'contactNumber') ILIKE ? OR "+
			"lower(product->>'productName') ILIKE ?)",
			searchParam, searchParam, searchParam, searchParam, searchParam)
	}

	// Filter by active status
	query = query.Where("order_status = ?", req.OrderStatus)

	// Filter data from two months ago until the current date
	query = query.Where("created_at >= ? AND created_at <= ?", twoMonthsAgo, time.Now())

	// Execute the query
	var orderDataValue []models.OrderData
	if err := query.Find(&orderDataValue).Error; err != nil {
		return nil, status.Error(codes.Internal, fmt.Sprintf("Failed to fetch order data: %v", err))
	}

	// Map the retrieved data to protobuf message
	for _, data := range orderDataValue {
		response.OrderData = append(response.OrderData, &pb.OrderData{
			OrderId:         data.OrderId.String(),
			Customer:        string(data.Customer),
			CompleteAddress: string(data.CompleteAddress),
			Product:         string(data.Product),
			Total:           data.Total,
			OrderStatus:     data.OrderStatus,
			TrackingId:      data.TrackingId,
			StickyNotes:     string(data.StickyNotes),
			CreatedBy:       data.CreatedBy.String(),
			CreatedAt:       data.CreatedAt.Unix(),
			UpdatedBy:       data.UpdatedBy.String(),
			UpdatedAt:       data.UpdatedAt.Unix(),
		})
	}

	return response, nil
}

func (s *ChronexAdminService) UpdateOrder(ctx context.Context, req *pb.UpdateOrderRequest) (*pb.UpdateOrderResponse, error) {
	// Retrieve existing OrderData from the database
	var existingOrderData models.OrderData
	if err := s.DB.First(&existingOrderData, "order_id = ?", req.GetOrderId()).First(&existingOrderData).Error; err != nil {
		log.Printf("Error retrieving Order data: %v", err)
		return nil, err
	}

	// Update the existing ProductData with new values if they are not nil
	if req.Customer != "" {
		existingOrderData.Customer = json.RawMessage(req.Customer)
	}
	if req.CompleteAddress != "" {
		existingOrderData.CompleteAddress = json.RawMessage(req.CompleteAddress)
	}
	if req.Product != "" {
		existingOrderData.Product = json.RawMessage(req.Product)
	}
	if req.Total != 0 {
		existingOrderData.Total = req.Total
	}
	if req.Product != "" {
		// Decode req.Product array
		var products []struct {
			Freebies        string  `json:"freebies"`
			Quantity        int     `json:"quantity"`
			ProductID       string  `json:"productId"`
			ProductName     string  `json:"productName"`
			DiscountedPrice float64 `json:"discountedPrice"`
		}
		if err := json.Unmarshal([]byte(req.Product), &products); err != nil {
			log.Printf("Error decoding product data: %v", err)
			return nil, err
		}

		// Deduct product quantity if orderStatus is SHP or DLV
		if (existingOrderData.OrderStatus == "ACT" || existingOrderData.OrderStatus == "PEN" || existingOrderData.OrderStatus == "CAN") && (req.OrderStatus == "SHP" || req.OrderStatus == "DLV") {
			for _, product := range products {
				// Convert productID string to UUID
				productID, err := uuid.Parse(product.ProductID)
				if err != nil {
					log.Printf("Error parsing product ID %s: %v", product.ProductID, err)
					return nil, err
				}

				// Retrieve product data from the database
				var productData models.ProductData
				if err := s.DB.First(&productData, "product_id = ?", productID).Error; err != nil {
					log.Printf("Error retrieving product data for product ID %s: %v", productID, err)
					return nil, err
				}

				// Update product quantity
				productData.CurrentQuantity -= float64(product.Quantity)

				// Save the updated product data back to the database
				if err := s.DB.Save(&productData).Error; err != nil {
					log.Printf("Error updating product data: %v", err)
					return nil, err
				}

				if product.Freebies != "" {
					// Retrieve product data from the database
					var freebiesData models.FreebiesData
					if err := s.DB.First(&freebiesData, "freebies_name = ?", product.Freebies).Error; err != nil {
						log.Printf("Error retrieving freebies data for freebies Name %s: %v", productID, err)
						return nil, err
					}

					freebiesData.FreebiesCurrentQuantity -= float64(product.Quantity)

					// Save the updated product data back to the database
					if err := s.DB.Save(&freebiesData).Error; err != nil {
						log.Printf("Error updating freebies data: %v", err)
						return nil, err
					}
				}

			}
		} else if (existingOrderData.OrderStatus == "SHP" || existingOrderData.OrderStatus == "DLV") && (req.OrderStatus == "PEN" || req.OrderStatus == "ACT" || req.OrderStatus == "CAN") {
			for _, product := range products {
				// Convert productID string to UUID
				productID, err := uuid.Parse(product.ProductID)
				if err != nil {
					log.Printf("Error parsing product ID %s: %v", product.ProductID, err)
					return nil, err
				}

				// Retrieve product data from the database
				var productData models.ProductData
				if err := s.DB.First(&productData, "product_id = ?", productID).Error; err != nil {
					log.Printf("Error retrieving product data for product ID %s: %v", productID, err)
					return nil, err
				}

				// Update product quantity
				productData.CurrentQuantity += float64(product.Quantity)

				// Save the updated product data back to the database
				if err := s.DB.Save(&productData).Error; err != nil {
					log.Printf("Error updating product data: %v", err)
					return nil, err
				}

				if product.Freebies != "" {
					// Retrieve product data from the database
					var freebiesData models.FreebiesData
					if err := s.DB.First(&freebiesData, "freebies_name = ?", product.Freebies).Error; err != nil {
						log.Printf("Error retrieving freebies data for freebies Name %s: %v", productID, err)
						return nil, err
					}

					freebiesData.FreebiesCurrentQuantity += float64(product.Quantity)

					// Save the updated product data back to the database
					if err := s.DB.Save(&freebiesData).Error; err != nil {
						log.Printf("Error updating freebies data: %v", err)
						return nil, err
					}
				}
			}
		}

		existingOrderData.OrderStatus = req.OrderStatus
	}

	if req.TrackingId != "" {
		existingOrderData.TrackingId = req.TrackingId
	}

	if req.StickyNotes != "" {
		sticky, err := json.Marshal(req.StickyNotes)
		if err != nil {
			log.Printf("Error marshaling descrip2: %v", err)
			return nil, err
		}
		existingOrderData.StickyNotes = json.RawMessage(sticky)
	}

	// Save the updated data back to the database using GORM
	if err := s.DB.Save(&existingOrderData).Error; err != nil {
		log.Printf("Error updating Order data: %v", err)
		return nil, err
	}

	// Create and return the response
	response := &pb.UpdateOrderResponse{
		OrderData: &pb.OrderData{
			OrderId:         existingOrderData.GetOrderId().String(),
			Customer:        string(existingOrderData.GetCustomer()),
			CompleteAddress: string(existingOrderData.GetCompleteAddress()),
			Product:         string(existingOrderData.GetProduct()),
			Total:           existingOrderData.GetTotal(),
			OrderStatus:     existingOrderData.GetOrderStatus(),
			TrackingId:      existingOrderData.GetTrackingId(),
			StickyNotes:     string(existingOrderData.GetStickyNotes()),
			CreatedBy:       existingOrderData.CreatedBy.String(),
			CreatedAt:       existingOrderData.CreatedAt.Unix(),
			UpdatedBy:       existingOrderData.UpdatedBy.String(),
			UpdatedAt:       existingOrderData.UpdatedAt.Unix(),
		},
	}

	return response, nil
}

func (s *ChronexAdminService) UpdateOrderStatus(ctx context.Context, req *pb.UpdateOrderStatusRequest) (*pb.UpdateOrderStatusResponse, error) {
	// Retrieve existing FreebiesData from the database
	var existingOrderData models.OrderData
	if err := s.DB.First(&existingOrderData, "order_id = ?", req.GetOrderId()).First(&existingOrderData).Error; err != nil {
		log.Printf("Error retrieving Order data: %v", err)
		return nil, err
	}

	// Update the existing FreebiesData with new values if they are not nil
	if req.OrderStatus != "" {
		existingOrderData.OrderStatus = req.OrderStatus
	}

	// Save the updated data back to the database using GORM
	if err := s.DB.Save(&existingOrderData).Error; err != nil {
		log.Printf("Error updating Order data: %v", err)
		return nil, err
	}

	// Create and return the response
	response := &pb.UpdateOrderStatusResponse{
		OrderData: &pb.OrderData{
			OrderId:         existingOrderData.GetOrderId().String(),
			Customer:        string(existingOrderData.GetCustomer()),
			CompleteAddress: string(existingOrderData.GetCompleteAddress()),
			Product:         string(existingOrderData.GetProduct()),
			Total:           existingOrderData.GetTotal(),
			OrderStatus:     existingOrderData.GetOrderStatus(),
			TrackingId:      existingOrderData.GetTrackingId(),
			StickyNotes:     string(existingOrderData.GetStickyNotes()),
			CreatedBy:       existingOrderData.CreatedBy.String(),
			CreatedAt:       existingOrderData.CreatedAt.Unix(),
			UpdatedBy:       existingOrderData.UpdatedBy.String(),
			UpdatedAt:       existingOrderData.UpdatedAt.Unix(),
		},
	}

	return response, nil
}

func (s *ChronexAdminService) GetAllOrderRevenue(ctx context.Context, req *pb.GetAllOrderRevenueRequest) (*pb.GetAllOrderRevenueResponse, error) {
	currentYear, currentMonth, _ := time.Now().Date()

	// Retrieve current month's data with "DLV" status
	currentData, err := models.GetTotalSalesPerDayWithStatus(s.DB, "DLV", currentYear, currentMonth) // Replace s.DB with your database connection
	if err != nil {
		return nil, err
	}

	// Retrieve previous month's data with "DLV" status
	previousYear, previousMonth := currentYear, currentMonth-1
	if previousMonth == 0 {
		previousMonth = 12
		previousYear--
	}
	previousData, err := models.GetTotalSalesPerDayWithStatus(s.DB, "DLV", previousYear, previousMonth)
	if err != nil {
		return nil, err
	}

	// Convert maps to string representations
	currentDataString, err := json.Marshal(currentData)
	if err != nil {
		return nil, err
	}

	previousDataString, err := json.Marshal(previousData)
	if err != nil {
		return nil, err
	}

	return &pb.GetAllOrderRevenueResponse{
		CurrentData:  string(currentDataString),
		PreviousData: string(previousDataString),
	}, nil
}

// GetAllTotalOrder retrieves total order quantity per day for a specific month and order status
func (s *ChronexAdminService) GetAllTotalOrder(ctx context.Context, req *pb.GetAllTotalOrderRequest) (*pb.GetAllTotalOrderResponse, error) {
	// Get current year and month
	currentYear, currentMonth, _ := time.Now().Date()

	// Retrieve current month's data with the specified order status
	currentData, err := models.GetAllTotalOrder(s.DB, req.OrderStatus, currentYear, currentMonth)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "failed to retrieve current month's data: %v", err)
	}

	// Retrieve previous month's data with the specified order status
	previousYear, previousMonth := currentYear, currentMonth-1
	if previousMonth == 0 {
		previousMonth = 12
		previousYear--
	}
	previousData, err := models.GetAllTotalOrder(s.DB, req.OrderStatus, previousYear, previousMonth)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "failed to retrieve previous month's data: %v", err)
	}

	// Convert maps to JSON strings
	currentDataString, err := json.Marshal(currentData)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "failed to marshal current month's data: %v", err)
	}

	previousDataString, err := json.Marshal(previousData)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "failed to marshal previous month's data: %v", err)
	}

	// Return the gRPC response
	return &pb.GetAllTotalOrderResponse{
		CurrentData:  string(currentDataString),
		PreviousData: string(previousDataString),
	}, nil
}

// Modify the gRPC service method
func (s *ChronexAdminService) GetBestSellingProducts(ctx context.Context, req *pb.GetBestSellingProductsRequest) (*pb.GetBestSellingProductsResponse, error) {
	// Get current year and month
	currentYear, currentMonth, _ := time.Now().Date()

	// Retrieve best selling products for the current month
	bestSellingProducts, err := models.GetBestSellingProducts(s.DB, req.OrderStatus, currentYear, currentMonth)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "failed to retrieve best selling products: %v", err)
	}

	// Convert best selling products to JSON string
	bestSellingProductsString, err := json.Marshal(bestSellingProducts)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "failed to marshal best selling products: %v", err)
	}

	// Return the gRPC response
	return &pb.GetBestSellingProductsResponse{
		BestSellingProducts: string(bestSellingProductsString),
	}, nil
}
