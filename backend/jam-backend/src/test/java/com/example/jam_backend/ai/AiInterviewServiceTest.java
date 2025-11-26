package com.example.jam_backend.ai;

import com.example.jam_backend.interview.*;
import com.example.jam_backend.interview.dto.AiTurnDto;
import com.example.jam_backend.llm.LlmClient;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AiInterviewServiceTest {

    @Mock
    private InterviewRepository interviewRepository;

    @Mock
    private InterviewTurnRepository turnRepository;

    @Mock
    private LlmClient llmClient;

    @InjectMocks
    private AiInterviewService aiInterviewService;

    @Test
    void start_creates_first_turn() {
        UUID interviewId = UUID.randomUUID();
        Interview interview = new Interview();
        interview.setId(interviewId);
        interview.setType(InterviewType.AI);

        when(interviewRepository.findById(interviewId)).thenReturn(Optional.of(interview));
        when(turnRepository.countByInterview(interview)).thenReturn(0);
        when(llmClient.chatWithGeneral(
                ArgumentMatchers.anyList(),
                ArgumentMatchers.anyDouble(),
                ArgumentMatchers.anyDouble(),
                ArgumentMatchers.anyInt()
        )).thenReturn("Первый вопрос собеседования?");

        AiTurnDto turn = aiInterviewService.start(interviewId);

        assertThat(turn.getTurnNumber()).isEqualTo(1);
        assertThat(turn.getQuestion()).contains("Первый вопрос");
    }
}


