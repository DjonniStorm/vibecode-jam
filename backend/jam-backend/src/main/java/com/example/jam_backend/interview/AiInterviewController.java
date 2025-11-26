package com.example.jam_backend.interview;

import com.example.jam_backend.interview.dto.AiAnswerRequest;
import com.example.jam_backend.interview.dto.AiAnswerResponse;
import com.example.jam_backend.interview.dto.AiTurnDto;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/ai-interviews")
public class AiInterviewController {

    private final AiInterviewService aiInterviewService;

    public AiInterviewController(AiInterviewService aiInterviewService) {
        this.aiInterviewService = aiInterviewService;
    }

    @PostMapping("/{interviewId}/start")
    public ResponseEntity<AiTurnDto> start(@PathVariable UUID interviewId) {
        return ResponseEntity.ok(aiInterviewService.start(interviewId));
    }

    @PostMapping("/{interviewId}/answer")
    public ResponseEntity<AiAnswerResponse> answer(@PathVariable UUID interviewId,
                                                   @Valid @RequestBody AiAnswerRequest request) {
        return ResponseEntity.ok(aiInterviewService.answer(interviewId, request));
    }

    @GetMapping("/{interviewId}/turns")
    public ResponseEntity<List<AiTurnDto>> getTurns(@PathVariable UUID interviewId) {
        return ResponseEntity.ok(aiInterviewService.getTurns(interviewId));
    }

    @PostMapping("/{interviewId}/finish")
    public ResponseEntity<Void> finish(@PathVariable UUID interviewId) {
        aiInterviewService.finish(interviewId);
        return ResponseEntity.ok().build();
    }
}


