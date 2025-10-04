package com.example.backend.Dao;

import com.example.backend.Entity.Enums.Role;

public interface LightUserView {
    Long getId();
    String getEmail();
    String getMotdepasse();
    String getNom();
    String getPrenom();
    Role getRole();
}
