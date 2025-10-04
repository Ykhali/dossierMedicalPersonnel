package com.example.backend.Dto;

import java.time.*;

public record HoraireRequest(
        LocalDate dateSpecific,     // null => weekly rule
        DayOfWeek dayOfWeek,        // null => date-specific rule
        String start,               // "HH:mm"
        String end                  // "HH:mm"
) {}
