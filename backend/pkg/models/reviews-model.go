package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ReviewsData struct {
	ReviewsId         uuid.UUID      `gorm:"type:uuid;primaryKey;default:uuid_generate_v4()"`
	ProductId         string         `gorm:"type:text"`
	ReviewsName       string         `gorm:"type:text"`
	ReviewsSubject    string         `gorm:"type:text"`
	ReviewsMessage    string         `gorm:"type:text"`
	ReviewsStarRating int64          `gorm:"type:int"`
	ReviewsStatus     string         `gorm:"type:text"`
	CreatedBy         uuid.UUID      `gorm:"type:uuid"`
	CreatedAt         time.Time      `gorm:"type:timestamptz;autoCreateTime"`
	UpdatedBy         uuid.UUID      `gorm:"type:uuid"`
	UpdatedAt         time.Time      `gorm:"type:timestamptz;autoUpdateTime"`
	DeletedAt         gorm.DeletedAt `gorm:"softDelete: true"`
}

func (ReviewsData) TableName() string {
	return "chronex_product_reviews"
}

func (p ReviewsData) GetReviewsId() uuid.UUID {
	if p.ReviewsId == uuid.Nil {
		return uuid.UUID{}
	}
	return p.ReviewsId
}

func (p ReviewsData) GetProductId() string {
	if p.ProductId == "" {
		return ""
	}

	return p.ReviewsName
}

func (p ReviewsData) GetReviewsName() string {
	if p.ReviewsName == "" {
		return ""
	}

	return p.ReviewsName
}

func (p ReviewsData) GetReviewsSubject() string {
	if p.ReviewsSubject == "" {
		return ""
	}

	return p.ReviewsSubject
}

func (p ReviewsData) GetReviewsMessage() string {
	if p.ReviewsMessage == "" {
		return ""
	}

	return p.ReviewsMessage
}

func (p ReviewsData) GetReviewsStatus() string {
	if p.ReviewsStatus == "" {
		return ""
	}

	return p.ReviewsStatus
}

func (p ReviewsData) GetReviewsStarRating() int64 {
	if p.ReviewsStarRating == 0 {
		p.ReviewsStarRating = 0
	}

	return p.ReviewsStarRating
}
