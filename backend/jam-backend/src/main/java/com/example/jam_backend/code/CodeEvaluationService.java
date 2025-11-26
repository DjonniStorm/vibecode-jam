package com.example.jam_backend.code;

import com.example.jam_backend.llm.LlmClient;
import com.example.jam_backend.llm.dto.LlmMessage;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CodeEvaluationService {

    private final LlmClient llmClient;
    private final ObjectMapper objectMapper;

    public CodeEvaluationService(LlmClient llmClient, ObjectMapper objectMapper) {
        this.llmClient = llmClient;
        this.objectMapper = objectMapper;
    }

    public Result evaluateCode(String question, String language, String userCode) {
        String system = "Ты помощник, который строго и детально проверяет код на " + language + ". " +
                "Проанализируй код кандидата и верни ТОЛЬКО JSON без пояснений.";

        String user = """
                {
                  "task": "%s",
                  "language": "%s",
                  "code": "%s",
                  "expected_format": {
                    "is_correct": "boolean",
                    "score": "0..10",
                    "issues": ["список текстовых замечаний"],
                    "suggested_fix": "краткое улучшенное решение либо подсказка"
                  }
                }
                """.formatted(escapeForJson(question), language, escapeForJson(userCode));

        String raw = llmClient.chatWithCoder(
                List.of(
                        new LlmMessage("system", system),
                        new LlmMessage("user", user)
                ),
                0.2,
                0.8,
                512
        );

        return parseResult(raw);
    }

    private String escapeForJson(String input) {
        return input.replace("\\", "\\\\").replace("\"", "\\\"");
    }

    private Result parseResult(String raw) {
        // если модель вернула текст + JSON, пытаемся вытащить первую JSON-структуру
        String jsonPart = raw.trim();
        int firstBrace = jsonPart.indexOf('{');
        int lastBrace = jsonPart.lastIndexOf('}');
        if (firstBrace >= 0 && lastBrace > firstBrace) {
            jsonPart = jsonPart.substring(firstBrace, lastBrace + 1);
        }

        try {
            JsonNode node = objectMapper.readTree(jsonPart);
            Result result = new Result();
            result.setRaw(raw);
            result.setCorrect(node.path("is_correct").asBoolean(false));
            if (node.has("score")) {
                result.setScore(node.path("score").asInt());
            }
            if (node.has("suggested_fix")) {
                result.setSuggestedFix(node.path("suggested_fix").asText());
            }
            if (node.has("issues") && node.get("issues").isArray()) {
                StringBuilder sb = new StringBuilder();
                for (JsonNode issue : node.get("issues")) {
                    if (sb.length() > 0) {
                        sb.append("; ");
                    }
                    sb.append(issue.asText());
                }
                result.setIssues(sb.toString());
            }
            return result;
        } catch (JsonProcessingException e) {
            Result fallback = new Result();
            fallback.setRaw(raw);
            fallback.setCorrect(false);
            fallback.setIssues("Не удалось распарсить JSON от модели");
            return fallback;
        }
    }

    public static class Result {
        private boolean correct;
        private Integer score;
        private String issues;
        private String suggestedFix;
        private String raw;

        public boolean isCorrect() {
            return correct;
        }

        public void setCorrect(boolean correct) {
            this.correct = correct;
        }

        public Integer getScore() {
            return score;
        }

        public void setScore(Integer score) {
            this.score = score;
        }

        public String getIssues() {
            return issues;
        }

        public void setIssues(String issues) {
            this.issues = issues;
        }

        public String getSuggestedFix() {
            return suggestedFix;
        }

        public void setSuggestedFix(String suggestedFix) {
            this.suggestedFix = suggestedFix;
        }

        public String getRaw() {
            return raw;
        }

        public void setRaw(String raw) {
            this.raw = raw;
        }
    }
}


