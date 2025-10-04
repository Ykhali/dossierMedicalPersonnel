package com.example.backend.Dto;

import com.example.backend.Entity.Enums.StatusRendezVous;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

public class ChangeStatusRequest {

    
    private StatusRendezVous newStatus;

    public ChangeStatusRequest() {
    }

    public ChangeStatusRequest(StatusRendezVous status) {
        this.newStatus = status;
    }

    public StatusRendezVous getNewStatus() {
        return newStatus;
    }

    public void setNewStatus(StatusRendezVous newStatus) {
        this.newStatus = newStatus;
    }
}
