package com.buildcon.erp.payload.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AiChatResponse {

    private String response;

    public AiChatResponse(String response) {
        this.response = response;
    }
}
