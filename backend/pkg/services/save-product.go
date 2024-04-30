package services

import (
	"api/pkg/models"
	"api/pkg/pb"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"strings"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"gorm.io/gorm"
)

type ChronexAdminService struct {
	pb.UnimplementedChronexAdminProtoServiceServer
	DB *gorm.DB
}

func InitChronexService(db *gorm.DB) *ChronexAdminService {
	return &ChronexAdminService{DB: db}
}

func (s *ChronexAdminService) SaveProduct(ctx context.Context, req *pb.SaveProductRequest) (*pb.SaveProductResponse, error) {

	images, err := json.Marshal(req.Img)
	if err != nil {
		log.Printf("Error marshaling descrip2: %v", err)
		return nil, err
	}

	descrip2, err := json.Marshal(req.Description2)
	if err != nil {
		log.Printf("Error marshaling descrip2: %v", err)
		return nil, err
	}

	productFreebies, err := json.Marshal(req.ProductFreebies)
	if err != nil {
		log.Printf("Error marshaling descrip2: %v", err)
		return nil, err
	}

	// Create a new PDFExtractorData instance
	productData := models.ProductData{
		ProductName:      req.ProductName,
		Img:              json.RawMessage(images),
		Discount:         req.Discount,
		SupplierPrice:    req.SupplierPrice,
		OriginalPrice:    req.OriginalPrice,
		DiscountedPrice:  req.DiscountedPrice,
		Description1:     req.Description1,
		Description2:     json.RawMessage(descrip2),
		OriginalQuantity: req.OriginalQuantity,
		CurrentQuantity:  req.CurrentQuantity,
		ProductStatus:    req.ProductStatus,
		ProductSold:      req.ProductSold,
		ProductFreebies:  json.RawMessage(productFreebies),
	}

	// Save the data to the database using GORM
	if err := s.DB.Create(&productData).Error; err != nil {
		log.Printf("Error saving PDF data: %v", err)
		return nil, err
	}

	// Create and return the response
	response := &pb.SaveProductResponse{
		ProductData: &pb.ProductData{
			ProductName:      productData.ProductName,
			Img:              string(productData.Img),
			Discount:         productData.Discount,
			OriginalPrice:    productData.OriginalPrice,
			DiscountedPrice:  productData.DiscountedPrice,
			Description1:     productData.Description1,
			Description2:     string(productData.Description2),
			OriginalQuantity: productData.OriginalQuantity,
			CurrentQuantity:  productData.CurrentQuantity,
			ProductStatus:    productData.ProductStatus,
			ProductSold:      productData.ProductSold,
			ProductFreebies:  string(productData.ProductFreebies),
			CreatedBy:        productData.CreatedBy.String(),
			CreatedAt:        productData.CreatedAt.Unix(),
			UpdatedBy:        productData.UpdatedBy.String(),
			UpdatedAt:        productData.UpdatedAt.Unix(),
		},
	}

	return response, nil
}

func convertSortOptionProduct(sortOptionStr string) pb.SortOptionProduct {
	switch strings.ToUpper(sortOptionStr) {
	case "ATOZ":
		return pb.SortOptionProduct_PRODUCT_ATOZ
	case "ZTOA":
		return pb.SortOptionProduct_PRODUCT_ZTOA
	case "PRICE_HIGH_TO_LOW":
		return pb.SortOptionProduct_PRODUCT_PRICE_HIGH_TO_LOW
	case "PRICE_LOW_TO_HIGH":
		return pb.SortOptionProduct_PRODUCT_PRICE_LOW_TO_HIGH
	case "QUANTITY_HIGH_TO_LOW":
		return pb.SortOptionProduct_PRODUCT_QUANTITY_HIGH_TO_LOW
	case "QUANTITY_LOW_TO_HIGH":
		return pb.SortOptionProduct_PRODUCT_QUANTITY_LOW_TO_HIGH
	case "PRODUCT_SUPPLIER_HIGH_TO_LOW":
		return pb.SortOptionProduct_PRODUCT_SUPPLIER_HIGH_TO_LOW
	case "PRODUCT_SUPPLIER_LOW_TO_HIGH":
		return pb.SortOptionProduct_PRODUCT_SUPPLIER_LOW_TO_HIGH
	default:
		return pb.SortOptionProduct_PRODUCT_ATOZ
	}
}

func (s *ChronexAdminService) GetAllProduct(ctx context.Context, req *pb.GetAllProductRequest) (*pb.GetAllProductResponse, error) {
	response := &pb.GetAllProductResponse{
		ProductData: []*pb.ProductData{},
	}

	// Build your query based on the request parameters
	query := s.DB.Model(&models.ProductData{})

	// Convert sort option string to enum value
	sortOption := convertSortOptionProduct(req.SortOptionProduct)

	// Handle sorting
	switch sortOption {
	case pb.SortOptionProduct_PRODUCT_ATOZ:
		query = query.Order("product_name ASC")
	case pb.SortOptionProduct_PRODUCT_ZTOA:
		query = query.Order("product_name DESC")
	case pb.SortOptionProduct_PRODUCT_PRICE_HIGH_TO_LOW:
		query = query.Order("discounted_price DESC")
	case pb.SortOptionProduct_PRODUCT_PRICE_LOW_TO_HIGH:
		query = query.Order("discounted_price ASC")
	case pb.SortOptionProduct_PRODUCT_QUANTITY_HIGH_TO_LOW:
		query = query.Order("current_quantity DESC")
	case pb.SortOptionProduct_PRODUCT_QUANTITY_LOW_TO_HIGH:
		query = query.Order("current_quantity ASC")
	case pb.SortOptionProduct_PRODUCT_SUPPLIER_HIGH_TO_LOW:
		query = query.Order("supplier_price DESC")
	case pb.SortOptionProduct_PRODUCT_SUPPLIER_LOW_TO_HIGH:
		query = query.Order("supplier_price ASC")
	}

	// Handle searching
	if req.Search != "" {
		query = query.Where("product_name ILIKE ?", "%"+req.Search+"%")
	}

	// Filter by active status
	query = query.Where("product_status != ?", "DEL")

	// Execute the query
	var productDataValue []models.ProductData
	if err := query.Find(&productDataValue).Error; err != nil {
		return nil, status.Error(codes.Internal, fmt.Sprintf("Failed to fetch product data: %v", err))
	}

	// Map the retrieved data to protobuf message
	for _, data := range productDataValue {
		response.ProductData = append(response.ProductData, &pb.ProductData{
			ProductId:        data.ProductId.String(),
			ProductName:      data.ProductName,
			Img:              string(data.Img),
			Discount:         data.Discount,
			SupplierPrice:    data.SupplierPrice,
			OriginalPrice:    data.OriginalPrice,
			DiscountedPrice:  data.DiscountedPrice,
			Description1:     data.Description1,
			Description2:     string(data.Description2),
			OriginalQuantity: data.OriginalQuantity,
			CurrentQuantity:  data.CurrentQuantity,
			ProductStatus:    data.ProductStatus,
			ProductSold:      data.ProductSold,
			ProductFreebies:  string(data.ProductFreebies),
			CreatedBy:        data.CreatedBy.String(),
			CreatedAt:        data.CreatedAt.Unix(),
			UpdatedBy:        data.UpdatedBy.String(),
			UpdatedAt:        data.UpdatedAt.Unix(),
		})
	}

	return response, nil
}

func (s *ChronexAdminService) GetAllProductById(ctx context.Context, req *pb.GetAllProductRequestById) (*pb.GetAllProductResponseById, error) {
	response := &pb.GetAllProductResponseById{
		ProductData: []*pb.ProductData{},
	}

	// Fetch the freebie by its ID and status
	var product models.ProductData
	if err := s.DB.Where("product_id = ? AND product_status != ?", req.ProductId, "DEL").Find(&product).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, status.Error(codes.NotFound, fmt.Sprintf("Product with ID %s not found", req.ProductId))
		}
		return nil, status.Error(codes.Internal, fmt.Sprintf("Failed to fetch product data: %v", err))
	}

	// Map the fetched freebie to protobuf message
	response.ProductData = append(response.ProductData, &pb.ProductData{
		ProductId:        product.ProductId.String(),
		ProductName:      product.ProductName,
		Img:              string(product.Img),
		Discount:         product.Discount,
		SupplierPrice:    product.SupplierPrice,
		OriginalPrice:    product.OriginalPrice,
		DiscountedPrice:  product.DiscountedPrice,
		Description1:     product.Description1,
		Description2:     string(product.Description2),
		OriginalQuantity: product.OriginalQuantity,
		CurrentQuantity:  product.CurrentQuantity,
		ProductStatus:    product.ProductStatus,
		ProductSold:      product.ProductSold,
		ProductFreebies:  string(product.ProductFreebies),
		CreatedBy:        product.CreatedBy.String(),
		CreatedAt:        product.CreatedAt.Unix(),
		UpdatedBy:        product.UpdatedBy.String(),
		UpdatedAt:        product.UpdatedAt.Unix(),
	})

	return response, nil
}

func (s *ChronexAdminService) UpdateProduct(ctx context.Context, req *pb.UpdateProductRequest) (*pb.UpdateProductResponse, error) {
	// Retrieve existing ProductData from the database
	var existingProductData models.ProductData
	if err := s.DB.First(&existingProductData, "product_id = ?", req.GetProductId()).First(&existingProductData).Error; err != nil {
		log.Printf("Error retrieving Product data: %v", err)
		return nil, err
	}

	// Update the existing ProductData with new values if they are not nil
	if req.ProductName != "" {
		existingProductData.ProductName = req.ProductName
	}
	if req.Img != "" {
		images, err := json.Marshal(req.Img)
		if err != nil {
			log.Printf("Error marshaling descrip2: %v", err)
			return nil, err
		}
		existingProductData.Img = json.RawMessage(images)
	}
	if req.Discount != 0 {
		existingProductData.Discount = req.Discount
	}
	if req.SupplierPrice != 0 {
		existingProductData.SupplierPrice = req.SupplierPrice
	}
	if req.OriginalPrice != 0 {
		existingProductData.OriginalPrice = req.OriginalPrice
	}
	if req.DiscountedPrice != 0 {
		existingProductData.DiscountedPrice = req.DiscountedPrice
	}
	if req.Description1 != "" {
		existingProductData.Description1 = req.Description1
	}
	if req.Description2 != "" {
		descrip2, err := json.Marshal(req.Description2)
		if err != nil {
			log.Printf("Error marshaling descrip2: %v", err)
			return nil, err
		}
		existingProductData.Description2 = json.RawMessage(descrip2)
	}
	if req.ProductSold != 0 {
		existingProductData.ProductSold = req.ProductSold
	}
	if req.ProductFreebies != "" {
		productFreebies, err := json.Marshal(req.ProductFreebies)
		if err != nil {
			log.Printf("Error marshaling descrip2: %v", err)
			return nil, err
		}
		existingProductData.ProductFreebies = json.RawMessage(productFreebies)
	}
	if req.ProductStatus != "" {
		existingProductData.ProductStatus = req.ProductStatus
	}

	// Save the updated data back to the database using GORM
	if err := s.DB.Save(&existingProductData).Error; err != nil {
		log.Printf("Error updating Product data: %v", err)
		return nil, err
	}

	// Create and return the response
	response := &pb.UpdateProductResponse{
		ProductData: &pb.ProductData{
			ProductId:        existingProductData.GetProductId().String(),
			ProductName:      existingProductData.GetProductName(),
			Img:              string(existingProductData.GetImg()),
			Discount:         existingProductData.GetDiscount(),
			SupplierPrice:    existingProductData.GetSupplierPrice(),
			OriginalPrice:    existingProductData.GetOriginalPrice(),
			DiscountedPrice:  existingProductData.GetDiscountedPrice(),
			Description1:     existingProductData.GetDescription1(),
			Description2:     string(existingProductData.GetDescription2()),
			OriginalQuantity: existingProductData.GetOriginalQuantity(),
			CurrentQuantity:  existingProductData.GetCurrentQuantity(),
			ProductStatus:    existingProductData.GetProductStatus(),
			ProductSold:      existingProductData.GetProductSold(),
			ProductFreebies:  string(existingProductData.GetProductFreebies()),
			CreatedBy:        existingProductData.CreatedBy.String(),
			CreatedAt:        existingProductData.CreatedAt.Unix(),
			UpdatedBy:        existingProductData.UpdatedBy.String(),
			UpdatedAt:        existingProductData.UpdatedAt.Unix(),
		},
	}

	return response, nil
}

func (s *ChronexAdminService) UpdateProductQuantity(ctx context.Context, req *pb.UpdateProductQuantityRequest) (*pb.UpdateProductQuantityResponse, error) {
	// Retrieve existing ProductData from the database
	var existingProductData models.ProductData
	if err := s.DB.First(&existingProductData, "product_id = ?", req.GetProductId()).First(&existingProductData).Error; err != nil {
		log.Printf("Error retrieving Product data: %v", err)
		return nil, err
	}

	// Update the existing ProductData with new values if they are not nil
	if req.OriginalQuantity != 0 {
		existingProductData.OriginalQuantity = req.OriginalQuantity
	}
	if req.CurrentQuantity != 0 {
		existingProductData.CurrentQuantity = req.CurrentQuantity
	}

	// Save the updated data back to the database using GORM
	if err := s.DB.Save(&existingProductData).Error; err != nil {
		log.Printf("Error updating Product data: %v", err)
		return nil, err
	}

	// Create and return the response
	response := &pb.UpdateProductQuantityResponse{
		ProductData: &pb.ProductData{
			ProductId:        existingProductData.GetProductId().String(),
			ProductName:      existingProductData.GetProductName(),
			Img:              string(existingProductData.GetImg()),
			Discount:         existingProductData.GetDiscount(),
			SupplierPrice:    existingProductData.GetSupplierPrice(),
			OriginalPrice:    existingProductData.GetOriginalPrice(),
			DiscountedPrice:  existingProductData.GetDiscountedPrice(),
			Description1:     existingProductData.GetDescription1(),
			Description2:     string(existingProductData.GetDescription2()),
			OriginalQuantity: existingProductData.GetOriginalQuantity(),
			CurrentQuantity:  existingProductData.GetCurrentQuantity(),
			ProductStatus:    existingProductData.GetProductStatus(),
			ProductSold:      existingProductData.GetProductSold(),
			ProductFreebies:  string(existingProductData.GetProductFreebies()),
			CreatedBy:        existingProductData.CreatedBy.String(),
			CreatedAt:        existingProductData.CreatedAt.Unix(),
			UpdatedBy:        existingProductData.UpdatedBy.String(),
			UpdatedAt:        existingProductData.UpdatedAt.Unix(),
		},
	}

	return response, nil
}

func (s *ChronexAdminService) UpdateProductStatus(ctx context.Context, req *pb.UpdateProductStatusRequest) (*pb.UpdateProductStatusResponse, error) {
	// Retrieve existing ProductData from the database
	var existingProductData models.ProductData
	if err := s.DB.First(&existingProductData, "product_id = ?", req.GetProductId()).First(&existingProductData).Error; err != nil {
		log.Printf("Error retrieving Product data: %v", err)
		return nil, err
	}

	// Update the existing ProductData with new values if they are not nil
	if req.ProductStatus != "" {
		existingProductData.ProductStatus = req.ProductStatus
	}

	// Save the updated data back to the database using GORM
	if err := s.DB.Save(&existingProductData).Error; err != nil {
		log.Printf("Error updating Product data: %v", err)
		return nil, err
	}

	// Create and return the response
	response := &pb.UpdateProductStatusResponse{
		ProductData: &pb.ProductData{
			ProductId:        existingProductData.GetProductId().String(),
			ProductName:      existingProductData.GetProductName(),
			Img:              string(existingProductData.GetImg()),
			Discount:         existingProductData.GetDiscount(),
			SupplierPrice:    existingProductData.GetSupplierPrice(),
			OriginalPrice:    existingProductData.GetOriginalPrice(),
			DiscountedPrice:  existingProductData.GetDiscountedPrice(),
			Description1:     existingProductData.GetDescription1(),
			Description2:     string(existingProductData.GetDescription2()),
			OriginalQuantity: existingProductData.GetOriginalQuantity(),
			CurrentQuantity:  existingProductData.GetCurrentQuantity(),
			ProductStatus:    existingProductData.GetProductStatus(),
			ProductSold:      existingProductData.GetProductSold(),
			ProductFreebies:  string(existingProductData.GetProductFreebies()),
			CreatedBy:        existingProductData.CreatedBy.String(),
			CreatedAt:        existingProductData.CreatedAt.Unix(),
			UpdatedBy:        existingProductData.UpdatedBy.String(),
			UpdatedAt:        existingProductData.UpdatedAt.Unix(),
		},
	}

	return response, nil
}
