package platform.api.videostreamapi.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.PathVariable;

import platform.api.videostreamapi.domain.VideoData;
import platform.api.videostreamapi.services.VideoServices;
import reactor.core.publisher.Mono;

import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("api/video-manager")
public class VideoStreamApiRoutes {

    private VideoServices videoServices;

    public VideoStreamApiRoutes(VideoServices videoServices) {
        this.videoServices = videoServices;
    }

    @GetMapping(value = "test")
    public ResponseEntity<List<VideoData>> TEST() {

        List<VideoData> data = videoServices.GetVideoData(
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzY4MjcwMDN9.xSV2tmoAkX5QyDRnQUHq_TH_G9FCQpxzPaAO_YsYHJU");
        // System.out.println(data.get(0).getVideoTitle());
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    @GetMapping(value = "video-stream/{VideoToken}", produces = "video/mp4")
    public Mono<Resource> GetVideo(@PathVariable String VideoToken, @RequestHeader("Range") String range) {

        List<VideoData> data = videoServices.GetVideoData(VideoToken);
        if (!data.isEmpty()) {

            return videoServices.GetVideo(data.get(0).getOwnerToken(), VideoToken, data.get(0).getVideoTitle());
        }
        return null;
    }

}
