package config

import (
	"github.com/spf13/viper"
)

func InitEnv() *viper.Viper {
	vi := viper.New()
	vi.SetConfigFile(".env")
	vi.SetConfigType("env")
	vi.ReadInConfig()
	vi.AutomaticEnv()

	return vi
}
