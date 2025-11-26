package com.example.jam_backend.interview;

import com.example.jam_backend.interview.dto.AiAnswerRequest;
import com.example.jam_backend.interview.dto.AiAnswerResponse;
import com.example.jam_backend.interview.dto.AiTurnDto;
import com.example.jam_backend.llm.LlmClient;
import com.example.jam_backend.llm.dto.LlmMessage;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class AiInterviewService {

    private final InterviewRepository interviewRepository;
    private final InterviewTurnRepository turnRepository;
    private final LlmClient llmClient;

    public AiInterviewService(InterviewRepository interviewRepository,
                              InterviewTurnRepository turnRepository,
                              LlmClient llmClient) {
        this.interviewRepository = interviewRepository;
        this.turnRepository = turnRepository;
        this.llmClient = llmClient;
    }

    @Transactional
    public AiTurnDto start(UUID interviewId) {
        Interview interview = getInterview(interviewId);
        if (interview.getType() != InterviewType.AI) {
            throw new IllegalArgumentException("Interview is not AI type");
        }

        int nextTurnNumber = turnRepository.countByInterview(interview) + 1;

        List<LlmMessage> messages = new ArrayList<>();
        messages.add(new LlmMessage(
                "system",
                "Ты опытный технический интервьюер по алгоритмам и структурам данных. " +
                        "Задавай по одному вопросу, иногда требуя написать код. Не отвечай за кандидата."
        ));
        messages.add(new LlmMessage(
                "user",
                "Начни собеседование: задай первый вопрос. Если нужен код, явно напиши, на каком языке."
        ));

        String question = llmClient.chatWithGeneral(messages, 0.3, 0.9, 512);

        InterviewTurn turn = new InterviewTurn();
        turn.setInterview(interview);
        turn.setTurnNumber(nextTurnNumber);
        turn.setQuestion(question);
        boolean codeQuestion = question.toLowerCase().contains("напиши")
                || question.toLowerCase().contains("реализуй")
                || question.contains("```");
        turn.setCodeQuestion(codeQuestion);
        turn.setCodeLanguage(null);

        InterviewTurn saved = turnRepository.save(turn);
        return toDto(saved);
    }

    @Transactional
    public AiAnswerResponse answer(UUID interviewId, AiAnswerRequest request) {
        Interview interview = getInterview(interviewId);
        InterviewTurn lastTurn = turnRepository.findById(request.getTurnId())
                .orElseThrow(() -> new IllegalArgumentException("Turn not found"));
        if (!lastTurn.getInterview().getId().equals(interview.getId())) {
            throw new IllegalArgumentException("Turn does not belong to interview");
        }

        lastTurn.setUserAnswer(request.getAnswer());

        // Формируем оценку и следующий вопрос
        List<LlmMessage> messages = new ArrayList<>();
        messages.add(new LlmMessage(
                "system",
                "Ты опытный технический интервьюер. Сначала коротко оцени ответ кандидата (2-3 предложения), " +
                        "затем задай следующий вопрос. Пиши по-русски."
        ));
        messages.add(new LlmMessage(
                "user",
                "Вопрос интервьюера: \"" + lastTurn.getQuestion() + "\"\n" +
                        "Ответ кандидата: \"" + request.getAnswer() + "\"\n" +
                        "Сначала оцени ответ, затем после пустой строки задай следующий вопрос."
        ));

        String evaluationAndNext = llmClient.chatWithGeneral(messages, 0.4, 0.9, 512);

        // Простое разделение: первая часть до двойного перевода строки — оценка, остальное — следующий вопрос
        String[] parts = evaluationAndNext.split("\\n\\s*\\n", 2);
        String evaluation = parts[0].trim();
        String nextQuestion = parts.length > 1 ? parts[1].trim() : "";

        lastTurn.setEvaluation(evaluation);

        int nextTurnNumber = lastTurn.getTurnNumber() + 1;
        InterviewTurn nextTurn = new InterviewTurn();
        nextTurn.setInterview(interview);
        nextTurn.setTurnNumber(nextTurnNumber);
        nextTurn.setQuestion(nextQuestion);
        boolean codeQuestion = nextQuestion.toLowerCase().contains("напиши")
                || nextQuestion.toLowerCase().contains("реализуй")
                || nextQuestion.contains("```");
        nextTurn.setCodeQuestion(codeQuestion);

        AiAnswerResponse response = new AiAnswerResponse();
        response.setPreviousTurn(toDto(lastTurn));
        response.setNextTurn(toDto(turnRepository.save(nextTurn)));
        return response;
    }

    @Transactional(readOnly = true)
    public List<AiTurnDto> getTurns(UUID interviewId) {
        Interview interview = getInterview(interviewId);
        return turnRepository.findByInterviewOrderByTurnNumberAsc(interview).stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public void finish(UUID interviewId) {
        Interview interview = getInterview(interviewId);
        List<InterviewTurn> turns = turnRepository.findByInterviewOrderByTurnNumberAsc(interview);
        int totalScore = turns.stream()
                .map(InterviewTurn::getScore)
                .filter(s -> s != null)
                .mapToInt(Integer::intValue)
                .sum();
        interview.setTotalScore(totalScore);
    }

    private Interview getInterview(UUID id) {
        return interviewRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Interview not found"));
    }

    private AiTurnDto toDto(InterviewTurn turn) {
        AiTurnDto dto = new AiTurnDto();
        dto.setId(turn.getId());
        dto.setTurnNumber(turn.getTurnNumber());
        dto.setQuestion(turn.getQuestion());
        dto.setUserAnswer(turn.getUserAnswer());
        dto.setCodeQuestion(turn.isCodeQuestion());
        dto.setCodeLanguage(turn.getCodeLanguage());
        dto.setEvaluation(turn.getEvaluation());
        dto.setScore(turn.getScore());
        dto.setCreatedAt(turn.getCreatedAt());
        return dto;
    }
}


