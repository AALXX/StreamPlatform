package models

type Video struct {
	VideoTitle      string `json:"VideoTitle"`
	VideoToken      string `json:"VideoToken"`
	OwnerToken      string `json:"OwnerToken"`
	OwnerName       string `json:"UserName"`
	VideoVisibility string `json:"VideoVisibility"`
}

type SearchResult struct {
	VideoTitle      string
	VideoToken      string
	OwnerToken      string
	OwnerName       string
	VideoVisibility string
	Score           float64
}
