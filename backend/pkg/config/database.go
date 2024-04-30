package config

import (
	"fmt"

	"github.com/spf13/viper"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func InitDatabase(vi *viper.Viper) (*gorm.DB, error) {
	USER := vi.GetString("DB_USER")
	PASS := vi.GetString("DB_PASS")
	HOST := vi.GetString("DB_HOST")
	PORT := vi.GetString("DB_PORT")
	DBNAME := vi.GetString("DB_NAME")

	DSN := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s", HOST, USER, PASS, DBNAME, PORT)
	fmt.Println(DSN)
	db, err := gorm.Open(postgres.Open(DSN), &gorm.Config{})

	if err != nil {
		return db, err
	}

	return db, nil
}
