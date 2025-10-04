package com.example.backend.Service.Iservice;

import com.example.backend.Dto.AvailabilityResponse;

import java.time.LocalDate;

public interface AvailabilityService {
    AvailabilityResponse getAvailability(Long medecinId, LocalDate date, int slotMinutes);
}
