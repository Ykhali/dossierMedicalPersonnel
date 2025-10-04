package com.example.backend.Dto;

import java.util.List;

public record AvailabilityResponse(
        String date,                // "YYYY-MM-DD"
        Long medecinId,
        int slotMinutes,
        List<String> freeSlots      // ["09:00","09:30",...]
) {}
