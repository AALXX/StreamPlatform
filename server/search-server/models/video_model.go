package models

type Video struct {
	VideoTitle      string `json:"VideoTitle"`
	VideoToken      string `json:"VideoToken"`
	VideoVisibility string `json:"VideoVisibility"`
}

type SearchResult struct {
	VideoTitle      string
	VideoToken      string
	VideoVisibility string
	Score           float64
}
