package com.example.jam_backend.llm.dto;

import java.util.List;

public class LlmChatResponse {

    private List<Choice> data;

    public List<Choice> getData() {
        return data;
    }

    public void setData(List<Choice> data) {
        this.data = data;
    }

    public static class Choice {
        private String id;
        private Message message;

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public Message getMessage() {
            return message;
        }

        public void setMessage(Message message) {
            this.message = message;
        }
    }

    public static class Message {
        private String role;
        private String content;

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }
    }
}


