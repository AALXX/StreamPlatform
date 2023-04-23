package platform.api.videostreamapi.domain;


import jakarta.persistence.*;

@Entity
@Table(name = "videos")
public class VideosData {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private String VideoPath;

    public String getVideoPath() {
        return VideoPath;
    }

    public void setVideoPath(String videoPath) {
        VideoPath = videoPath;
    }
}
