package com.example.jam_backend.llm;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmbeddingService {

    private final LlmProperties properties;

    public EmbeddingService(LlmProperties properties) {
        this.properties = properties;
    }

    /**
     * Заглушка под будущую реализацию вызова bge-m3.
     * Сейчас возвращает пустой вектор, чтобы не ломать основной функционал.
     */
    public List<Float> embed(String text) {
        return List.of();
    }
}


