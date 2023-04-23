package platform.api.videostreamapi.services;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import platform.api.videostreamapi.domain.VideosData;

@Service
public class VideoServices implements IVideoServices {

    public String test() {
        return "CUM";
    }



    // It Get Video Data from videos table
    public List<Map<String, VideosData>> GetVideoData(String VideoToken) {
        
            var ResultMatches = (List<Map<String,Object>>)matchCountRepository.findByRecommendations()

        return ResultMatches;

    }
}
