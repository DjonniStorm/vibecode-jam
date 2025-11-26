package com.example.jam_backend.ai;

import com.example.jam_backend.interview.AiInterviewController;
import com.example.jam_backend.interview.AiInterviewService;
import com.example.jam_backend.interview.dto.AiAnswerRequest;
import com.example.jam_backend.interview.dto.AiAnswerResponse;
import com.example.jam_backend.interview.dto.AiTurnDto;
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
        AiTurnDto dto = new AiTurnDto();
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

        AiAnswerRequest request = new AiAnswerRequest();
        request.setTurnId(UUID.randomUUID());
        request.setAnswer("Ответ");

        AiAnswerResponse response = new AiAnswerResponse();
        response.setPreviousTurn(new AiTurnDto());
        response.setNextTurn(new AiTurnDto());

        Mockito.when(aiInterviewService.answer(eq(interviewId), any()))
                .thenReturn(response);

        mockMvc.perform(post("/api/ai-interviews/" + interviewId + "/answer")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }
}


