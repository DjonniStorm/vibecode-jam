package com.example.jam_backend.code;

import com.example.jam_backend.code.dto.CodeEvaluationRequest;
import com.example.jam_backend.code.dto.CodeEvaluationResult;
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

    @PostMapping
    public ResponseEntity<CodeEvaluationResult> evaluate(@RequestBody CodeEvaluationRequest request) {
        CodeEvaluationResult result = service.evaluateCode(
                request.getQuestion(),
                request.getLanguage(),
                request.getCode()
        );
        return ResponseEntity.ok(result);
    }
}


