package com.example.backend.Dto;

public class VerifyPhoneRequest {
    private String code;

    public VerifyPhoneRequest( String code) {
        this.code = code;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}
