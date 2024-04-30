package binding

import "encoding/json"

type SaveHomeImagesRequest struct {
	HomeImg json.RawMessage `json:"homeImg"`
}
