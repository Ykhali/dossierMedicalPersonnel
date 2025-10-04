package com.example.backend.Dao;

public interface AuthUserView {
    Long getId();
    String getEmail();
    String getMotdepasse();// hash BCrypt
    String getTelephone();
    String getCin();
    String getNom();
    String getPrenom();
    com.example.backend.Entity.Enums.Role getRole();
    Boolean getDeleted();

}
