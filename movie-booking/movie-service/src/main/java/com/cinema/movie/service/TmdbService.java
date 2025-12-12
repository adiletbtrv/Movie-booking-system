package com.cinema.movie.service;

import com.cinema.movie.dto.ActorDto;
import com.cinema.movie.dto.MovieDto;
import com.cinema.movie.repository.MovieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TmdbService {

    private final MovieService movieService;
    private final MovieRepository movieRepository;

    @Value("${tmdb.api-key}")
    private String apiKey;

    @Value("${tmdb.base-url}")
    private String baseUrl;

    private final RestClient restClient = RestClient.create();

    @Transactional
    public MovieDto importMovie(Long tmdbId) {
        if (movieRepository.findByTmdbId(tmdbId).isPresent()) {
            throw new RuntimeException("Movie with TMDB ID " + tmdbId + " already exists");
        }

        MovieDto movieDto = fetchFromTmdb(tmdbId);
        return movieService.createMovie(movieDto);
    }

    private MovieDto fetchFromTmdb(Long tmdbId) {
        if ("mock-key".equals(apiKey)) {
            return getMockData(tmdbId);
        }

        try {
            // Fetch movie details
            Map<String, Object> movieResponse = restClient.get()
                    .uri(baseUrl + "/movie/" + tmdbId + "?api_key=" + apiKey + "&append_to_response=credits,videos,release_dates")
                    .retrieve()
                    .body(Map.class);

            if (movieResponse == null) {
                throw new RuntimeException("Failed to fetch movie from TMDB");
            }

            MovieDto dto = new MovieDto();
            dto.setTmdbId(tmdbId);
            dto.setTitle((String) movieResponse.get("title"));
            dto.setDescription((String) movieResponse.get("overview"));
            
            Object runtime = movieResponse.get("runtime");
            if (runtime instanceof Integer) {
                 dto.setDurationMinutes((Integer) runtime);
            }
           
            String releaseDateStr = (String) movieResponse.get("release_date");
            if (releaseDateStr != null && !releaseDateStr.isEmpty()) {
                dto.setReleaseDate(LocalDate.parse(releaseDateStr));
            }
            
            dto.setPosterUrl("https://image.tmdb.org/t/p/w500" + movieResponse.get("poster_path"));
            
            Object voteAverage = movieResponse.get("vote_average");
            if (voteAverage instanceof Number) {
                dto.setRating(((Number) voteAverage).doubleValue());
            }

            // Genres
            List<Map<String, Object>> genres = (List<Map<String, Object>>) movieResponse.get("genres");
            if (genres != null) {
                dto.setGenres(genres.stream()
                        .map(g -> (String) g.get("name"))
                        .collect(Collectors.toList()));
            }

            // Actors (Credits)
            Map<String, Object> credits = (Map<String, Object>) movieResponse.get("credits");
            if (credits != null) {
                List<Map<String, Object>> cast = (List<Map<String, Object>>) credits.get("cast");
                if (cast != null) {
                    dto.setActors(cast.stream()
                            .limit(10) // Limit to top 10 actors
                            .map(c -> {
                                ActorDto actorDto = new ActorDto();
                                actorDto.setName((String) c.get("name"));
                                actorDto.setTmdbId(((Number) c.get("id")).longValue());
                                actorDto.setPhotoUrl("https://image.tmdb.org/t/p/w200" + c.get("profile_path"));
                                actorDto.setCharacterName((String) c.get("character"));
                                return actorDto;
                            })
                            .collect(Collectors.toList()));
                }
            }
            
            // Trailer (Videos)
             Map<String, Object> videos = (Map<String, Object>) movieResponse.get("videos");
             if (videos != null) {
                 List<Map<String, Object>> results = (List<Map<String, Object>>) videos.get("results");
                 if (results != null) {
                     results.stream()
                         .filter(v -> "Trailer".equals(v.get("type")) && "YouTube".equals(v.get("site")))
                         .findFirst()
                         .ifPresent(v -> dto.setTrailerUrl("https://www.youtube.com/watch?v=" + v.get("key")));
                 }
             }

            return dto;

        } catch (Exception e) {
            throw new RuntimeException("Error fetching from TMDB: " + e.getMessage(), e);
        }
    }

    private MovieDto getMockData(Long tmdbId) {
        MovieDto dto = new MovieDto();
        dto.setTmdbId(tmdbId);
        dto.setTitle("Mocked Movie Title from TMDB " + tmdbId);
        dto.setDescription("This is a mocked description for movie " + tmdbId);
        dto.setRating(8.5);
        dto.setDurationMinutes(120);
        dto.setReleaseDate(LocalDate.now());
        dto.setPosterUrl("https://image.tmdb.org/t/p/w500/mock.jpg");
        dto.setTrailerUrl("https://youtube.com/watch?v=mocked");
        dto.setGenres(List.of("Action", "Sci-Fi"));
        
        List<ActorDto> actors = new ArrayList<>();
        actors.add(new ActorDto("Mock Actor 1", 101L, "http://image.url/1", "Character 1"));
        actors.add(new ActorDto("Mock Actor 2", 102L, "http://image.url/2", "Character 2"));
        dto.setActors(actors);
        
        return dto;
    }
}
