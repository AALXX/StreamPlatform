package platform.api.videostreamapi.controller;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.PathVariable;
import platform.api.videostreamapi.services.VideoServices;

@RestController
@RequestMapping("api/video-manager")
public class VideoStreamApiRoutes {
   
    private VideoServices videoServices;

    public VideoStreamApiRoutes(VideoServices videoServices){
        this.videoServices = videoServices;
    }


    @GetMapping("/test")
    public String list(){
        return videoServices.test();
    }

    @GetMapping(value = "video-stream/{VideoToken}", produces = "video/mp4")
    public Mono<Resource> GetVideo(@PathVariable String VideoToken, @RequestHeader("Range") String range) {
        List<VideoData> data = GetVideoData(VideoToken);
        return videoServices.GetVideo(data.get(0).getVideoPath());
    }
    
}
