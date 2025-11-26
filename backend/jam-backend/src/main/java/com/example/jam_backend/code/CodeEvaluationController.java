package com.example.jam_backend.code;

import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/code-evaluation")
public class CodeEvaluationController {

    private final CodeEvaluationService service;

    public CodeEvaluationController(CodeEvaluationService service) {
        this.service = service;
    }

    public static class Request {
        @NotBlank
        private String question;

        @NotBlank
        private String language;

        @NotBlank
        private String code;

        public String getQuestion() {
            return question;
        }

        public void setQuestion(String question) {
            this.question = question;
        }

        public String getLanguage() {
            return language;
        }

        public void setLanguage(String language) {
            this.language = language;
        }

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }
    }

    @PostMapping
    public ResponseEntity<CodeEvaluationService.Result> evaluate(@RequestBody Request request) {
        var result = service.evaluateCode(request.getQuestion(), request.getLanguage(), request.getCode());
        return ResponseEntity.ok(result);
    }
}


