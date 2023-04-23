package platform.api.videostreamapi.services;

import java.util.Map;
import java.util.List;
import org.springframework.data.jpa.repository.Query;

import platform.api.videostreamapi.domain.VideosData;

public interface IVideoServices {
    List<VideosData> GetVideoData(String VideoToken);

    @Query(value = "SELECT OwnerToken FROM videos WHERE VideoToken = ?", nativeQuery = true)
    public List<Map<String, Object>> getVideoOwnerToken();
}
