package models

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type HomeImagesData struct {
	HomeImagesId uuid.UUID       `gorm:"type:uuid;primaryKey;default:uuid_generate_v4()"`
	HomeImg      json.RawMessage `gorm:"type:jsonb"`
	CreatedBy    uuid.UUID       `gorm:"type:uuid"`
	CreatedAt    time.Time       `gorm:"type:timestamptz;autoCreateTime"`
	UpdatedBy    uuid.UUID       `gorm:"type:uuid"`
	UpdatedAt    time.Time       `gorm:"type:timestamptz;autoUpdateTime"`
	DeletedAt    gorm.DeletedAt  `gorm:"softDelete: true"`
}

func (HomeImagesData) TableName() string {
	return "chronex_product_home_images"
}

func (p HomeImagesData) GetHomeImagesId() uuid.UUID {
	if p.HomeImagesId == uuid.Nil {
		return uuid.UUID{}
	}
	return p.HomeImagesId
}

func (p HomeImagesData) GetHomeImg() json.RawMessage {
	return p.HomeImg
}
