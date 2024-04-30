package main

import (
	"api/pkg/pb"
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
)

type RestHandler struct {
	grpcClient pb.ChronexAdminProtoServiceClient
}

func NewRestHandler(grpcClient pb.ChronexAdminProtoServiceClient) *RestHandler {
	return &RestHandler{grpcClient: grpcClient}
}

func (h *RestHandler) GetTotalRevenue(c *gin.Context) {
	req := &pb.GetAllOrderRevenueRequest{} // You can add fields to the request if needed
	resp, err := h.grpcClient.GetAllOrderRevenue(context.Background(), req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, resp)
}
