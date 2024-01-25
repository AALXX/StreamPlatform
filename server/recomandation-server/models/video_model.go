package models

type VideoRecomandationRequest struct {
    USerToken   string `json:"UserToken"`
    LastVideos  [3]string `json:"LastVideos"`
}