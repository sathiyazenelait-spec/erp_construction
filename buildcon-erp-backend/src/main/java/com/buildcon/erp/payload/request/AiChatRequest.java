package com.buildcon.erp.payload.request;

import jakarta.validation.constraints.NotBlank;

public class AiChatRequest {

    @NotBlank
    private String message;

    private String role;

    private String context;

    public AiChatRequest() {
    }

    public AiChatRequest(String message, String role, String context) {
        this.message = message;
        this.role = role;
        this.context = context;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getContext() {
        return context;
    }

    public void setContext(String context) {
        this.context = context;
    }
}
