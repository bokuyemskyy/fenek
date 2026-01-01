package dev.fenek.chats.service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import dev.fenek.chats.dto.UserBatchRequest;
import dev.fenek.chats.dto.UserBatchResponse;
import dev.fenek.chats.dto.UserResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class UsersServiceClient {

    private final RestTemplate restTemplate;

    @Value("${app.service-token}")
    private String serviceToken;

    @Value("${app.users-service-url}")
    private String userServiceUrl;

    public List<UserResponse> getUsersBatch(UUID requesterId, List<UUID> userIds) {
        String url = userServiceUrl + "/users/batch";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-Service-Token", serviceToken);

        HttpEntity<UserBatchRequest> entity = new HttpEntity<>(new UserBatchRequest(requesterId, userIds), headers);

        ResponseEntity<UserBatchResponse> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                entity,
                UserBatchResponse.class);

        return response.getBody().getUsers();
    }
}