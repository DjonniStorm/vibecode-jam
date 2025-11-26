package com.example.jam_backend.llm;

import com.example.jam_backend.llm.dto.LlmChatRequest;
import com.example.jam_backend.llm.dto.LlmChatResponse;
import com.example.jam_backend.llm.dto.LlmMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.List;

@Service
public class LlmClient {

    private static final Logger log = LoggerFactory.getLogger(LlmClient.class);

    private final RestTemplate restTemplate;
    private final LlmProperties properties;

    public LlmClient(LlmProperties properties) {
        this.properties = properties;
        this.restTemplate = createRestTemplate();
    }

    private RestTemplate createRestTemplate() {
        RestTemplate template = new RestTemplate();
        // здесь можно настроить timeouts через HttpClient, оставим по умолчанию для простоты
        return template;
    }

    public String chatWithGeneral(List<LlmMessage> messages,
                                  Double temperature,
                                  Double topP,
                                  Integer maxTokens) {
        return chat(properties.getModels().getChat(), messages, temperature, topP, maxTokens);
    }

    public String chatWithCoder(List<LlmMessage> messages,
                                Double temperature,
                                Double topP,
                                Integer maxTokens) {
        return chat(properties.getModels().getCoder(), messages, temperature, topP, maxTokens);
    }

    public String chat(String model,
                       List<LlmMessage> messages,
                       Double temperature,
                       Double topP,
                       Integer maxTokens) {
        LlmChatRequest request = new LlmChatRequest();
        request.setModel(model);
        request.setMessages(messages);
        request.setTemperature(temperature);
        request.setTop_p(topP);
        request.setMax_tokens(maxTokens);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(properties.getApiKey());

        HttpEntity<LlmChatRequest> entity = new HttpEntity<>(request, headers);

        String url = properties.getBaseUrl() + "/v1/chat/completions";

        int attempts = 0;
        int maxAttempts = 3;
        while (true) {
            attempts++;
            try {
                ResponseEntity<LlmChatResponse> response = restTemplate.exchange(
                        url,
                        HttpMethod.POST,
                        entity,
                        LlmChatResponse.class
                );
                LlmChatResponse body = response.getBody();
                if (body != null && body.getData() != null && !body.getData().isEmpty()) {
                    LlmChatResponse.Choice choice = body.getData().get(0);
                    if (choice.getMessage() != null) {
                        return choice.getMessage().getContent();
                    }
                }
                return "";
            } catch (RestClientException ex) {
                log.warn("LLM request failed (attempt {} of {}): {}", attempts, maxAttempts, ex.getMessage());
                if (attempts >= maxAttempts) {
                    throw ex;
                }
                try {
                    Thread.sleep(Duration.ofSeconds(2L * attempts).toMillis());
                } catch (InterruptedException ignored) {
                    Thread.currentThread().interrupt();
                    throw ex;
                }
            }
        }
    }
}


