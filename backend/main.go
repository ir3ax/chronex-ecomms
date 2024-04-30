package main

import (
	"api/pkg/binding"
	"api/pkg/config"
	"api/pkg/models"
	"api/pkg/pb"
	"api/pkg/services"
	"context"
	"crypto/tls"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
	"github.com/tealeg/xlsx"
	"gopkg.in/mail.v2"
	"gorm.io/gorm"
)

func main() {
	env := config.InitEnv()
	port := getPort(env)
	database, err := getDatabase(env)

	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	ChronexSvc := services.InitChronexService(database)

	log.Printf("Server is now listening on port %s", port)

	// Initialize Gin router
	router := gin.Default()

	// CORS middleware
	router.Use(corsMiddleware())
	//Product
	router.POST("/admin/product", gin.Bind(binding.SaveProductRequest{}), SaveProductHandler(ChronexSvc))
	router.GET("/admin/product-sort/:sort", GetAllProductHandler(ChronexSvc))
	router.GET("/admin/product/:productId", GetAllProductByIdHandler(ChronexSvc))
	router.PUT("/admin/product-update", gin.Bind(binding.UpdateProductRequest{}), UpdateProductHandler(ChronexSvc))
	router.PUT("/admin/product-update-quantity", gin.Bind(binding.UpdateProductQuantityRequest{}), UpdateProductQuantityHandler(ChronexSvc))
	router.PUT("/admin/product-update-status", gin.Bind(binding.UpdateProductStatusRequest{}), UpdateProductStatusHandler(ChronexSvc))
	//Freebies
	router.POST("/admin/freebies", gin.Bind(binding.SaveFreebiesRequest{}), SaveFreebiesHandler(ChronexSvc))
	router.GET("/admin/freebies-sort/:sort", GetAllFreebiesHandler(ChronexSvc))
	router.GET("/admin/freebies-dropdown", GetAllFreebiesDropdownHandler(ChronexSvc))
	router.GET("/admin/freebies/:freebiesId", GetAllFreebiesByIdHandler(ChronexSvc))
	router.PUT("/admin/freebies-update", gin.Bind(binding.UpdateFreebiesRequest{}), UpdateFreebiesHandler(ChronexSvc))
	router.PUT("/admin/freebies-update-quantity", gin.Bind(binding.UpdateFreebiesQuantityRequest{}), UpdateFreebiesQuantityHandler(ChronexSvc))
	router.PUT("/admin/freebies-update-status", gin.Bind(binding.UpdateFreebiesStatusRequest{}), UpdateFreebiesStatusHandler(ChronexSvc))
	//Order
	router.POST("/admin/order", gin.Bind(binding.SaveOrderRequest{}), SaveOrderHandler(ChronexSvc))
	router.GET("/admin/order-sort/:sort", GetAllOrderHandler(ChronexSvc))
	router.PUT("/admin/order-update", gin.Bind(binding.UpdateOrderRequest{}), UpdateOrderHandler(ChronexSvc))
	router.PUT("/admin/order-update-status", gin.Bind(binding.UpdateOrderStatusRequest{}), UpdateOrderStatusHandler(ChronexSvc))
	router.GET("/admin/order-total-quantity", gin.Bind(binding.GetAllTotalOrderRequest{}), GetAllTotalOrderHandler(ChronexSvc))
	router.GET("/admin/best-selling", gin.Bind(binding.GetBestSellingProductsRequest{}), GetBestSellingProductsHandler(ChronexSvc))
	router.GET("/admin/order-revenue", GetTotalRevenueHandler(ChronexSvc))
	//Reviews
	router.POST("/admin/reviews", gin.Bind(binding.SaveReviewsRequest{}), SaveReviewsHandler(ChronexSvc))
	router.GET("/admin/reviews-sort/:sort", GetAllReviewsHandler(ChronexSvc))
	router.GET("/admin/reviews/:reviewsId", GetAllReviewsByIdHandler(ChronexSvc))
	router.PUT("/admin/reviews-update", gin.Bind(binding.UpdateReviewsRequest{}), UpdateReviewsHandler(ChronexSvc))
	router.PUT("/admin/reviews-update-status", gin.Bind(binding.UpdateReviewsStatusRequest{}), UpdateReviewsStatusHandler(ChronexSvc))
	//EMAIL-SENDING
	router.POST("/send-email", sendEmailHandler(env))
	//GENERATE-REPORT
	router.GET("/generate-revenue", func(c *gin.Context) {
		generateExcelRevenue(c, database) // Pass only the database instance here
	})
	router.GET("/generate-total-order", func(c *gin.Context) {
		generateExcelTotalOrder(c, database) // Pass only the database instance here
	})
	router.GET("/generate-best-selling", func(c *gin.Context) {
		generateExcelBestSellingProducts(c, database) // Pass only the database instance here
	})
	router.GET("/generate-total-expenses", func(c *gin.Context) {
		generateExcelTotalExpenses(c, database) // Pass only the database instance here
	})
	//HOME-IMAGES
	router.POST("/admin/home-images", gin.Bind(binding.SaveHomeImagesRequest{}), SaveHomeImages(ChronexSvc))
	router.GET("/admin/home-images-get", GetAllHomeImages(ChronexSvc))
	router.PUT("/admin/home-images-update", gin.Bind(binding.UpdateHomeImagesRequest{}), UpdateHomeImagesHandler(ChronexSvc))
	router.DELETE("/admin/home-images-delete/:homeImagesId", DeleteHomeImagesHandler(ChronexSvc))

	// Create a new HTTP server
	httpServer := &http.Server{
		Addr:    fmt.Sprintf(":%s", port),
		Handler: router,
	}

	// Handle graceful shutdown
	shutdownChannel := make(chan os.Signal, 1)
	signal.Notify(shutdownChannel, syscall.SIGINT, syscall.SIGTERM)

	// Start the HTTP server
	go func() {
		if err := httpServer.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Failed to start HTTP server: %v", err)
		}
	}()

	// Wait for shutdown signal
	<-shutdownChannel

	if err := httpServer.Shutdown(context.Background()); err != nil {
		log.Fatalf("Failed to stop HTTP server gracefully: %v", err)
	}

	log.Println("Server has shut down gracefully")
}

// Product Handler
func SaveProductHandler(ChronexSvc *services.ChronexAdminService) gin.HandlerFunc {
	return func(c *gin.Context) {
		productDetails := c.MustGet(gin.BindKey).(*binding.SaveProductRequest)

		productDetailsRes, err := ChronexSvc.SaveProduct(c, &pb.SaveProductRequest{
			ProductName:      productDetails.ProductName,
			Img:              string(productDetails.Img),
			Discount:         productDetails.Discount,
			SupplierPrice:    productDetails.SupplierPrice,
			OriginalPrice:    productDetails.OriginalPrice,
			DiscountedPrice:  productDetails.DiscountedPrice,
			Description1:     productDetails.Description1,
			Description2:     string(productDetails.Description2),
			OriginalQuantity: productDetails.OriginalQuantity,
			CurrentQuantity:  productDetails.CurrentQuantity,
			ProductStatus:    productDetails.ProductStatus,
			ProductSold:      productDetails.ProductSold,
			ProductFreebies:  string(productDetails.ProductFreebies),
		})

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		c.JSON(http.StatusOK, productDetailsRes)
	}
}

func GetAllProductHandler(ChronexSvc *services.ChronexAdminService) gin.HandlerFunc {
	return func(c *gin.Context) {
		sort := c.Param("sort")
		search := c.Query("search")

		productDetailsRes, err := ChronexSvc.GetAllProduct(c, &pb.GetAllProductRequest{
			Search:            search,
			SortOptionProduct: sort,
		})

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		c.JSON(http.StatusOK, productDetailsRes)
	}
}

func GetAllProductByIdHandler(ChronexSvc *services.ChronexAdminService) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Extract the FreebiesId parameter from the request
		productId := c.Param("productId")

		// Call the company service
		productDetailsRes, err := ChronexSvc.GetAllProductById(c, &pb.GetAllProductRequestById{
			ProductId: productId,
		})

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		c.JSON(http.StatusOK, productDetailsRes)
	}
}

func UpdateProductHandler(ChronexSvc *services.ChronexAdminService) gin.HandlerFunc {
	return func(c *gin.Context) {
		productDetails := c.MustGet(gin.BindKey).(*binding.UpdateProductRequest)

		productDetailsRes, err := ChronexSvc.UpdateProduct(c, &pb.UpdateProductRequest{
			ProductId:       productDetails.ProductId,
			ProductName:     productDetails.ProductName,
			Img:             productDetails.Img,
			Discount:        productDetails.Discount,
			SupplierPrice:   productDetails.SupplierPrice,
			OriginalPrice:   productDetails.OriginalPrice,
			DiscountedPrice: productDetails.DiscountedPrice,
			Description1:    productDetails.Description1,
			Description2:    productDetails.Description2,
			ProductStatus:   productDetails.ProductStatus,
			ProductSold:     productDetails.ProductSold,
			ProductFreebies: productDetails.ProductFreebies,
		})

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		c.JSON(http.StatusOK, productDetailsRes)
	}
}

func UpdateProductQuantityHandler(ChronexSvc *services.ChronexAdminService) gin.HandlerFunc {
	return func(c *gin.Context) {
		productDetails := c.MustGet(gin.BindKey).(*binding.UpdateProductQuantityRequest)

		productDetailsRes, err := ChronexSvc.UpdateProductQuantity(c, &pb.UpdateProductQuantityRequest{
			ProductId:        productDetails.ProductId,
			OriginalQuantity: productDetails.OriginalQuantity,
			CurrentQuantity:  productDetails.CurrentQuantity,
		})

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		c.JSON(http.StatusOK, productDetailsRes)
	}
}

func UpdateProductStatusHandler(ChronexSvc *services.ChronexAdminService) gin.HandlerFunc {
	return func(c *gin.Context) {
		productDetails := c.MustGet(gin.BindKey).(*binding.UpdateProductStatusRequest)

		productDetailsRes, err := ChronexSvc.UpdateProductStatus(c, &pb.UpdateProductStatusRequest{
			ProductId:     productDetails.ProductId,
			ProductStatus: productDetails.ProductStatus,
		})

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		c.JSON(http.StatusOK, productDetailsRes)
	}
}

// Freebies Handler
func SaveFreebiesHandler(ChronexSvc *services.ChronexAdminService) gin.HandlerFunc {
	return func(c *gin.Context) {
		freebiesDetails := c.MustGet(gin.BindKey).(*binding.SaveFreebiesRequest)

		freebiesDetailsRes, err := ChronexSvc.SaveFreebies(c, &pb.SaveFreebiesRequest{
			FreebiesName:             freebiesDetails.FreebiesName,
			FreebiesImg:              freebiesDetails.FreebiesImg,
			FreebiesStorePrice:       freebiesDetails.FreebiesStorePrice,
			FreebiesOriginalQuantity: freebiesDetails.FreebiesOriginalQuantity,
			FreebiesCurrentQuantity:  freebiesDetails.FreebiesCurrentQuantity,
			FreebiesStatus:           freebiesDetails.FreebiesStatus,
		})

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		c.JSON(http.StatusOK, freebiesDetailsRes)
	}
}

func GetAllFreebiesHandler(ChronexSvc *services.ChronexAdminService) gin.HandlerFunc {
	return func(c *gin.Context) {
		sort := c.Param("sort")
		search := c.Query("search")

		freebiesDetailsRes, err := ChronexSvc.GetAllFreebies(c, &pb.GetAllFreebiesRequest{
			Search:     search,
			SortOption: sort,
		})

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		c.JSON(http.StatusOK, freebiesDetailsRes)
	}
}

func GetAllFreebiesDropdownHandler(ChronexSvc *services.ChronexAdminService) gin.HandlerFunc {
	return func(c *gin.Context) {

		freebiesDetailsRes, err := ChronexSvc.GetAllFreebiesDropdown(c, &pb.GetAllFreebiesDropdownRequest{})

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		c.JSON(http.StatusOK, freebiesDetailsRes)
	}
}

func GetAllFreebiesByIdHandler(ChronexSvc *services.ChronexAdminService) gin.HandlerFunc {
	return func(c *gin.Context) {
		freebiesId := c.Param("freebiesId")

		// Call the company service
		freebiesDetailsRes, err := ChronexSvc.GetAllFreebiesById(c, &pb.GetAllFreebiesRequestById{
			FreebiesId: freebiesId,
		})

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		c.JSON(http.StatusOK, freebiesDetailsRes)
	}
}

func UpdateFreebiesHandler(ChronexSvc *services.ChronexAdminService) gin.HandlerFunc {
	return func(c *gin.Context) {
		freebiesDetails := c.MustGet(gin.BindKey).(*binding.UpdateFreebiesRequest)

		freebiesDetailsRes, err := ChronexSvc.UpdateFreebies(c, &pb.UpdateFreebiesRequest{
			FreebiesId:         freebiesDetails.FreebiesId,
			FreebiesName:       freebiesDetails.FreebiesName,
			FreebiesImg:        freebiesDetails.FreebiesImg,
			FreebiesStorePrice: freebiesDetails.FreebiesStorePrice,
			FreebiesStatus:     freebiesDetails.FreebiesStatus,
		})

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		c.JSON(http.StatusOK, freebiesDetailsRes)
	}
}

func UpdateFreebiesQuantityHandler(ChronexSvc *services.ChronexAdminService) gin.HandlerFunc {
	return func(c *gin.Context) {
		freebiesDetails := c.MustGet(gin.BindKey).(*binding.UpdateFreebiesQuantityRequest)

		freebiesDetailsRes, err := ChronexSvc.UpdateFreebiesQuantity(c, &pb.UpdateFreebiesQuantityRequest{
			FreebiesId:               freebiesDetails.FreebiesId,
			FreebiesOriginalQuantity: freebiesDetails.FreebiesOriginalQuantity,
			FreebiesCurrentQuantity:  freebiesDetails.FreebiesCurrentQuantity,
		})

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		c.JSON(http.StatusOK, freebiesDetailsRes)
	}
}

func UpdateFreebiesStatusHandler(ChronexSvc *services.ChronexAdminService) gin.HandlerFunc {
	return func(c *gin.Context) {
		freebiesDetails := c.MustGet(gin.BindKey).(*binding.UpdateFreebiesStatusRequest)

		freebiesDetailsRes, err := ChronexSvc.UpdateFreebiesStatus(c, &pb.UpdateFreebiesStatusRequest{
			FreebiesId:     freebiesDetails.FreebiesId,
			FreebiesStatus: freebiesDetails.FreebiesStatus,
		})

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		c.JSON(http.StatusOK, freebiesDetailsRes)
	}
}

// Order Handler
func SaveOrderHandler(ChronexSvc *services.ChronexAdminService) gin.HandlerFunc {
	return func(c *gin.Context) {
		orderDetails := c.MustGet(gin.BindKey).(*binding.SaveOrderRequest)

		orderDetailsRes, err := ChronexSvc.SaveOrder(c, &pb.SaveOrderRequest{
			Customer:        string(orderDetails.Customer),
			CompleteAddress: string(orderDetails.CompleteAddress),
			Product:         string(orderDetails.Product),
			Total:           orderDetails.Total,
			OrderStatus:     orderDetails.OrderStatus,
		})

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		c.JSON(http.StatusOK, orderDetailsRes)
	}
}

func GetAllOrderHandler(ChronexSvc *services.ChronexAdminService) gin.HandlerFunc {
	return func(c *gin.Context) {
		sort := c.Param("sort")
		search := c.Query("search")
		orderStatus := c.Query("orderStatus")

		orderDetailsRes, err := ChronexSvc.GetAllOrder(c, &pb.GetAllOrderRequest{
			Search:          search,
			SortOptionOrder: sort,
			OrderStatus:     orderStatus,
		})

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		c.JSON(http.StatusOK, orderDetailsRes)
	}
}

func UpdateOrderHandler(ChronexSvc *services.ChronexAdminService) gin.HandlerFunc {
	return func(c *gin.Context) {
		orderDetails := c.MustGet(gin.BindKey).(*binding.UpdateOrderRequest)

		orderDetailsRes, err := ChronexSvc.UpdateOrder(c, &pb.UpdateOrderRequest{
			OrderId:         orderDetails.OrderId,
			Customer:        string(orderDetails.Customer),
			CompleteAddress: string(orderDetails.CompleteAddress),
			Product:         string(orderDetails.Product),
			Total:           orderDetails.Total,
			OrderStatus:     orderDetails.OrderStatus,
			TrackingId:      orderDetails.TrackingId,
			StickyNotes:     string(orderDetails.StickyNotes),
		})

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		c.JSON(http.StatusOK, orderDetailsRes)
	}
}

func UpdateOrderStatusHandler(ChronexSvc *services.ChronexAdminService) gin.HandlerFunc {
	return func(c *gin.Context) {
		orderDetails := c.MustGet(gin.BindKey).(*binding.UpdateOrderStatusRequest)

		orderDetailsRes, err := ChronexSvc.UpdateOrderStatus(c, &pb.UpdateOrderStatusRequest{
			OrderId:     orderDetails.OrderId,
			OrderStatus: orderDetails.OrderStatus,
		})

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		c.JSON(http.StatusOK, orderDetailsRes)
	}
}

func GetTotalRevenueHandler(ChronexSvc *services.ChronexAdminService) gin.HandlerFunc {
	return func(c *gin.Context) {
		orderStatus := c.Query("orderStatus")

		orderDetailsRes, err := ChronexSvc.GetAllOrderRevenue(c, &pb.GetAllOrderRevenueRequest{
			OrderStatus: orderStatus,
		})

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		c.JSON(http.StatusOK, orderDetailsRes)
	}
}

func GetAllTotalOrderHandler(ChronexSvc *services.ChronexAdminService) gin.HandlerFunc {
	return func(c *gin.Context) {
		orderStatus := c.Query("orderStatus")

		orderDetailsRes, err := ChronexSvc.GetAllTotalOrder(c, &pb.GetAllTotalOrderRequest{
			OrderStatus: orderStatus,
		})

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		c.JSON(http.StatusOK, orderDetailsRes)
	}
}

func GetBestSellingProductsHandler(ChronexSvc *services.ChronexAdminService) gin.HandlerFunc {
	return func(c *gin.Context) {
		orderStatus := c.Query("orderStatus")

		orderDetailsRes, err := ChronexSvc.GetBestSellingProducts(c, &pb.GetBestSellingProductsRequest{
			OrderStatus: orderStatus,
		})

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		c.JSON(http.StatusOK, orderDetailsRes)
	}
}

// Reviews Handler
func SaveReviewsHandler(ChronexSvc *services.ChronexAdminService) gin.HandlerFunc {
	return func(c *gin.Context) {
		reviewsDetails := c.MustGet(gin.BindKey).(*binding.SaveReviewsRequest)

		reviewsDetailsRes, err := ChronexSvc.SaveReviews(c, &pb.SaveReviewsRequest{
			ProductId:         reviewsDetails.ProductId,
			ReviewsName:       reviewsDetails.ReviewsName,
			ReviewsSubject:    reviewsDetails.ReviewsSubject,
			ReviewsMessage:    reviewsDetails.ReviewsMessage,
			ReviewsStarRating: reviewsDetails.ReviewsStarRating,
		})

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		c.JSON(http.StatusOK, reviewsDetailsRes)
	}
}

func GetAllReviewsHandler(ChronexSvc *services.ChronexAdminService) gin.HandlerFunc {
	return func(c *gin.Context) {
		sort := c.Param("sort")
		search := c.Query("search")

		reviewsDetailsRes, err := ChronexSvc.GetAllReviews(c, &pb.GetAllReviewsRequest{
			Search:            search,
			SortOptionReviews: sort,
		})

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		c.JSON(http.StatusOK, reviewsDetailsRes)
	}
}

func UpdateReviewsHandler(ChronexSvc *services.ChronexAdminService) gin.HandlerFunc {
	return func(c *gin.Context) {
		reviewsDetails := c.MustGet(gin.BindKey).(*binding.UpdateReviewsRequest)

		reviewsDetailsRes, err := ChronexSvc.UpdateReviews(c, &pb.UpdateReviewsRequest{
			ReviewsId:         reviewsDetails.ReviewsId,
			ProductId:         reviewsDetails.ProductId,
			ReviewsName:       reviewsDetails.ReviewsName,
			ReviewsSubject:    reviewsDetails.ReviewsSubject,
			ReviewsMessage:    reviewsDetails.ReviewsMessage,
			ReviewsStarRating: reviewsDetails.ReviewsStarRating,
		})

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		c.JSON(http.StatusOK, reviewsDetailsRes)
	}
}

func UpdateReviewsStatusHandler(ChronexSvc *services.ChronexAdminService) gin.HandlerFunc {
	return func(c *gin.Context) {
		reviewsDetails := c.MustGet(gin.BindKey).(*binding.UpdateReviewsStatusRequest)

		reviewsDetailsRes, err := ChronexSvc.UpdateReviewsStatus(c, &pb.UpdateReviewsStatusRequest{
			ReviewsId:     reviewsDetails.ReviewsId,
			ReviewsStatus: reviewsDetails.ReviewsStatus,
		})

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		c.JSON(http.StatusOK, reviewsDetailsRes)
	}
}

func GetAllReviewsByIdHandler(ChronexSvc *services.ChronexAdminService) gin.HandlerFunc {
	return func(c *gin.Context) {
		reviewsId := c.Param("reviewsId")

		// Call the company service
		reviewsDetailsRes, err := ChronexSvc.GetAllReviewsById(c, &pb.GetAllReviewsRequestById{
			ReviewsId: reviewsId,
		})

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		c.JSON(http.StatusOK, reviewsDetailsRes)
	}
}

// EMAIL-SENDING
func sendEmailHandler(vi *viper.Viper) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Parse request body to get email details
		USER := vi.GetString("EMAIL_USER")
		PASS := vi.GetString("EMAIL_PASS")

		var emailData struct {
			To      string `json:"to"`
			Subject string `json:"subject"`
			Body    string `json:"body"`
		}
		if err := c.BindJSON(&emailData); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
			return
		}

		// Set up your email authentication credentials
		email := USER
		password := PASS

		// Initialize a new SMTP dialer
		d := mail.NewDialer("smtp.gmail.com", 587, email, password)

		// Set up TLS configuration to avoid certificate verification errors
		d.TLSConfig = &tls.Config{InsecureSkipVerify: true}

		// Create a new email message
		m := mail.NewMessage()
		m.SetHeader("From", email)
		m.SetHeader("To", emailData.To)
		m.SetHeader("Subject", emailData.Subject)
		// Set the email body as HTML
		m.SetBody("text/html", emailData.Body)

		// Dial and send the email
		if err := d.DialAndSend(m); err != nil {
			log.Printf("Failed to send email: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send email"})
			return
		}

		log.Println("Email sent successfully!")
		c.JSON(http.StatusOK, gin.H{"message": "Email sent successfully"})
	}
}

// GENERATE-REPORT
func generateExcelRevenue(c *gin.Context, db *gorm.DB) {
	var results []models.OrderData

	// Get the month and year parameters from query
	monthStr := c.Query("month")
	yearStr := c.Query("year")

	var month, year int
	var err error

	// Parse month
	if monthStr != "" {
		month, err = strconv.Atoi(monthStr)
		if err != nil || month < 1 || month > 12 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid month"})
			return
		}
	} else {
		// Default to current month if no month is provided
		month = int(time.Now().Month())
	}

	// Parse year
	if yearStr != "" {
		year, err = strconv.Atoi(yearStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid year"})
			return
		}
	} else {
		// Default to current year if no year is provided
		year = time.Now().Year()
	}

	// Filter orders by month, year, and order status
	db.Where("extract(month from created_at) = ? AND extract(year from created_at) = ? AND order_status = ?", month, year, "DLV").
		Order("created_at asc").
		Find(&results)

	// Create new Excel file
	file := xlsx.NewFile()
	sheet, err := file.AddSheet("Revenue Data")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Add header row
	header := sheet.AddRow()
	header.AddCell().SetValue("DATE")
	header.AddCell().SetValue("ORDER ID")
	header.AddCell().SetValue("TRACKING ID")
	header.AddCell().SetValue("CUSTOMER")
	header.AddCell().SetValue("COMPLETE ADDRESS")
	header.AddCell().SetValue("PRODUCT")
	header.AddCell().SetValue("ORDER STATUS")
	header.AddCell().SetValue("TOTAL")

	// Add data rows
	var grandTotal float64
	for _, result := range results {
		row := sheet.AddRow()
		row.AddCell().SetValue(result.CreatedAt.String())
		row.AddCell().SetValue(result.OrderId.String())
		row.AddCell().SetValue(result.TrackingId)
		row.AddCell().SetValue(string(result.Customer))
		row.AddCell().SetValue(string(result.CompleteAddress))
		row.AddCell().SetValue(string(result.Product))
		row.AddCell().SetValue(result.OrderStatus)
		row.AddCell().SetValue(fmt.Sprintf("%.2f", result.Total))
		// Accumulate total for grand total
		grandTotal += result.Total
	}

	// Add two empty rows
	sheet.AddRow()
	sheet.AddRow()

	// Add grand total row
	grandTotalRow := sheet.AddRow()
	grandTotalRow.AddCell().SetValue("")
	grandTotalRow.AddCell().SetValue("")
	grandTotalRow.AddCell().SetValue("")
	grandTotalRow.AddCell().SetValue("")
	grandTotalRow.AddCell().SetValue("")
	grandTotalRow.AddCell().SetValue("")
	grandTotalRow.AddCell().SetValue("Grand Total:")
	grandTotalRow.AddCell().SetValue(fmt.Sprintf("%.2f", grandTotal))

	// Create a temporary file to store the Excel
	tempFile, err := ioutil.TempFile("", "revenue_data_*.xlsx")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer tempFile.Close()

	// Save Excel file to the temporary file
	err = file.Write(tempFile)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Set the file as response attachment
	c.Writer.Header().Set("Content-Disposition", "attachment; filename=revenue_data.xlsx")
	c.Writer.Header().Set("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
	c.File(tempFile.Name())
}

func generateExcelTotalOrder(c *gin.Context, db *gorm.DB) {
	var results []models.OrderData // Assuming models.OrderData is the struct for your orders

	// Get the month and year parameters from query
	monthStr := c.Query("month")
	yearStr := c.Query("year")

	var month, year int
	var err error

	// Parse month
	if monthStr != "" {
		month, err = strconv.Atoi(monthStr)
		if err != nil || month < 1 || month > 12 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid month"})
			return
		}
	} else {
		// Default to current month if no month is provided
		month = int(time.Now().Month())
	}

	// Parse year
	if yearStr != "" {
		year, err = strconv.Atoi(yearStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid year"})
			return
		}
	} else {
		// Default to current year if no year is provided
		year = time.Now().Year()
	}

	// Filter orders by month and year
	db.Where("extract(month from created_at) = ? AND extract(year from created_at) = ? AND order_status = ?", month, year, "DLV").
		Order("created_at asc").
		Find(&results)

	// Initialize a map to store order counts for each day
	orderCounts := make(map[string]int)
	for _, order := range results {
		date := order.CreatedAt.Format("01-02-2006")
		orderCounts[date]++
	}

	// Create new Excel file
	file := xlsx.NewFile()
	sheet, err := file.AddSheet("Order Data")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Add header row
	header := sheet.AddRow()
	header.AddCell().SetValue("Date")
	header.AddCell().SetValue("Order")

	// Add data rows
	var totalOrders int
	for date, count := range orderCounts {
		row := sheet.AddRow()
		row.AddCell().SetValue(date)
		row.AddCell().SetValue(strconv.Itoa(count))
		totalOrders += count
	}

	sheet.AddRow()
	sheet.AddRow()
	// Add total orders row
	totalRow := sheet.AddRow()
	totalRow.AddCell().SetValue("Total Orders:")
	totalRow.AddCell().SetValue(strconv.Itoa(totalOrders))

	// Create a temporary file to store the Excel
	tempFile, err := ioutil.TempFile("", "total_order_data_*.xlsx")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer tempFile.Close()

	// Save Excel file to the temporary file
	err = file.Write(tempFile)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Set the file as response attachment
	c.Writer.Header().Set("Content-Disposition", "attachment; filename=order_data.xlsx")
	c.Writer.Header().Set("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
	c.File(tempFile.Name())
}

func generateExcelBestSellingProducts(c *gin.Context, db *gorm.DB) {
	var results []struct {
		ProductID          string
		ProductName        string
		TotalSales         float64
		TotalOrderQuantity int
	}

	// Get the month and year parameters from query
	monthStr := c.Query("month")
	yearStr := c.Query("year")
	var month int
	var year int
	var err error
	if monthStr != "" {
		month, err = strconv.Atoi(monthStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid month value"})
			return
		}
	} else {
		// Default to current month if no month is provided
		month = int(time.Now().Month())
	}
	if yearStr != "" {
		year, err = strconv.Atoi(yearStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid year value"})
			return
		}
	} else {
		// Default to current year if no year is provided
		year = time.Now().Year()
	}

	// Retrieve best selling products by unnesting the product array and then grouping by product ID and name
	err = db.Raw(`
	WITH products AS (
		SELECT
			order_id,
			(jsonb_array_elements(product)->>'productId')::text AS product_id,
			(jsonb_array_elements(product)->>'productName')::text AS product_name,
			(jsonb_array_elements(product)->>'quantity')::int AS quantity,
			(jsonb_array_elements(product)->>'discountedPrice')::numeric AS discounted_price,
			total
		FROM
			chronex_product_order
		WHERE
			order_status = ? 
			AND EXTRACT(YEAR FROM created_at) = ? 
			AND EXTRACT(MONTH FROM created_at) = ?
		)
		SELECT
			product_id,
			product_name,
			SUM(quantity * discounted_price) AS total_sales,
			SUM(quantity) AS total_order_quantity
		FROM
			products
		GROUP BY
			product_id, product_name
		ORDER BY
			total_sales DESC
	`, "DLV", year, month).Scan(&results).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Create new Excel file
	file := xlsx.NewFile()
	sheet, err := file.AddSheet("Best Selling Products")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Add header row
	header := sheet.AddRow()
	headerCell := header.AddCell()
	headerCell.SetValue("BEST SELLING PRODUCTS")
	headerCell.Merge(1, 4)
	headerCell.SetStyle(centeredCellStyle())

	// Add empty row for spacing
	sheet.AddRow()

	// Add subheader row
	subheader := sheet.AddRow()
	subheader.AddCell().SetValue("Product ID")
	subheader.AddCell().SetValue("Product Name")
	subheader.AddCell().SetValue("Total Sales")
	subheader.AddCell().SetValue("Total Order Quantity")

	// Add data rows
	for _, result := range results {
		row := sheet.AddRow()
		row.AddCell().SetValue(result.ProductID)
		row.AddCell().SetValue(result.ProductName)
		row.AddCell().SetValue(fmt.Sprintf("%.2f", result.TotalSales))
		row.AddCell().SetValue(strconv.Itoa(result.TotalOrderQuantity))
	}

	// Create a temporary file to store the Excel
	tempFile, err := ioutil.TempFile("", "best_selling_products_*.xlsx")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer tempFile.Close()

	// Save Excel file to the temporary file
	err = file.Write(tempFile)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Set the file as response attachment
	c.Writer.Header().Set("Content-Disposition", "attachment; filename=best_selling_products.xlsx")
	c.Writer.Header().Set("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
	c.File(tempFile.Name())
}

// Function to create a style with centered alignment
func centeredCellStyle() *xlsx.Style {
	style := xlsx.NewStyle()
	style.Alignment.Horizontal = "center"
	return style
}

func generateExcelTotalExpenses(c *gin.Context, db *gorm.DB) {
	var products []models.ProductData
	var freebies []models.FreebiesData

	// Get the month and year parameters from query
	monthStr := c.Query("month")
	yearStr := c.Query("year")

	var month, year int
	var err error

	// Parse month
	if monthStr != "" {
		month, err = strconv.Atoi(monthStr)
		if err != nil || month < 1 || month > 12 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid month"})
			return
		}
	} else {
		// Default to current month if no month is provided
		month = int(time.Now().Month())
	}

	// Parse year
	if yearStr != "" {
		year, err = strconv.Atoi(yearStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid year"})
			return
		}
	} else {
		// Default to current year if no year is provided
		year = time.Now().Year()
	}

	// Filter products by month and year
	db.Where("extract(month from created_at) = ? AND extract(year from created_at) = ?", month, year).Find(&products)

	// Filter freebies by month and year
	db.Where("extract(month from created_at) = ? AND extract(year from created_at) = ?", month, year).Find(&freebies)

	// Create new Excel file
	file := xlsx.NewFile()
	sheet, err := file.AddSheet("Total Expenses")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Add header row for products
	productHeader := sheet.AddRow()
	productHeader.AddCell().SetValue("Product Name")
	productHeader.AddCell().SetValue("Total Cost")

	// Add data rows for products
	var totalExpenses float64
	for _, product := range products {
		row := sheet.AddRow()
		row.AddCell().SetValue(product.ProductName)
		total := product.SupplierPrice * product.OriginalQuantity
		row.AddCell().SetValue(fmt.Sprintf("%.2f", total))
		totalExpenses += total
	}

	sheet.AddRow()

	// Add header row for freebies
	freebiesHeader := sheet.AddRow()
	freebiesHeader.AddCell().SetValue("Freebies Name")
	freebiesHeader.AddCell().SetValue("Total Cost")

	// Add data rows for freebies
	for _, freebie := range freebies {
		row := sheet.AddRow()
		row.AddCell().SetValue(freebie.FreebiesName)
		total := freebie.FreebiesStorePrice * freebie.FreebiesOriginalQuantity
		row.AddCell().SetValue(fmt.Sprintf("%.2f", total))
		totalExpenses += total
	}

	sheet.AddRow()
	sheet.AddRow()
	// Add grand total row
	grandTotalRow := sheet.AddRow()
	grandTotalRow.AddCell().SetValue("Grand Total")
	grandTotalRow.AddCell().SetValue(fmt.Sprintf("%.2f", totalExpenses))

	// Create a temporary file to store the Excel
	tempFile, err := ioutil.TempFile("", "total_expenses_*.xlsx")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer tempFile.Close()

	// Save Excel file to the temporary file
	err = file.Write(tempFile)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Set the file as response attachment
	c.Writer.Header().Set("Content-Disposition", "attachment; filename=total_expenses.xlsx")
	c.Writer.Header().Set("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
	c.File(tempFile.Name())
}

//Home-Images

func SaveHomeImages(ChronexSvc *services.ChronexAdminService) gin.HandlerFunc {
	return func(c *gin.Context) {
		homeImagesDetails := c.MustGet(gin.BindKey).(*binding.SaveHomeImagesRequest)

		homeImagesDetailsRes, err := ChronexSvc.SaveHomeImages(c, &pb.SaveHomeImagesRequest{
			HomeImg: string(homeImagesDetails.HomeImg),
		})

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		c.JSON(http.StatusOK, homeImagesDetailsRes)
	}
}

func GetAllHomeImages(ChronexSvc *services.ChronexAdminService) gin.HandlerFunc {
	return func(c *gin.Context) {

		homeImagesDetailsRes, err := ChronexSvc.GetAllHomeImages(c, &pb.GetAllHomeImagesRequest{})

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		c.JSON(http.StatusOK, homeImagesDetailsRes)
	}
}

func UpdateHomeImagesHandler(ChronexSvc *services.ChronexAdminService) gin.HandlerFunc {
	return func(c *gin.Context) {
		homeImagesDetails := c.MustGet(gin.BindKey).(*binding.UpdateHomeImagesRequest)

		homeImagesDetailsRes, err := ChronexSvc.UpdateHomeImages(c, &pb.UpdateHomeImagesRequest{
			HomeImagesId: homeImagesDetails.HomeImagesId,
			HomeImg:      homeImagesDetails.HomeImg,
		})

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		c.JSON(http.StatusOK, homeImagesDetailsRes)
	}
}

func DeleteHomeImagesHandler(ChronexSvc *services.ChronexAdminService) gin.HandlerFunc {
	return func(c *gin.Context) {
		homeImagesId := c.Param("homeImagesId")

		homeImagesDetailsRes, err := ChronexSvc.DeleteHomeImages(c, &pb.DeleteHomeImagesRequest{
			HomeImagesId: homeImagesId,
		})

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		c.JSON(http.StatusOK, homeImagesDetailsRes)
	}
}

// CORS Middleware
func corsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusOK)
			return
		}

		c.Next()
	}
}

func getDatabase(env *viper.Viper) (*gorm.DB, error) {
	database, err := config.InitDatabase(env)

	if err != nil {
		return nil, fmt.Errorf("Database failed to initialize: %v", err)
	}

	return database, nil
}

func getPort(env *viper.Viper) string {
	return env.GetString("PORT")
}
