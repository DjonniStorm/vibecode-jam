package com.example.jam_backend.ai;

import com.example.jam_backend.interview.AiInterviewController;
import com.example.jam_backend.interview.AiInterviewService;
import com.example.jam_backend.interview.dto.AiInterviewDtos;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AiInterviewController.class)
class AiInterviewControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AiInterviewService aiInterviewService;

    @Test
    @WithMockUser
    void start_endpoint_works() throws Exception {
        UUID interviewId = UUID.randomUUID();
        AiInterviewDtos.TurnDto dto = new AiInterviewDtos.TurnDto();
        dto.setId(UUID.randomUUID());
        dto.setTurnNumber(1);
        dto.setQuestion("Вопрос?");

        Mockito.when(aiInterviewService.start(eq(interviewId))).thenReturn(dto);

        mockMvc.perform(post("/api/ai-interviews/" + interviewId + "/start")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser
    void answer_endpoint_works() throws Exception {
        UUID interviewId = UUID.randomUUID();

        AiInterviewDtos.AnswerRequest request = new AiInterviewDtos.AnswerRequest();
        request.setTurnId(UUID.randomUUID());
        request.setAnswer("Ответ");

        AiInterviewDtos.AnswerResponse response = new AiInterviewDtos.AnswerResponse();
        response.setPreviousTurn(new AiInterviewDtos.TurnDto());
        response.setNextTurn(new AiInterviewDtos.TurnDto());

        Mockito.when(aiInterviewService.answer(eq(interviewId), any()))
                .thenReturn(response);

        mockMvc.perform(post("/api/ai-interviews/" + interviewId + "/answer")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }
}


