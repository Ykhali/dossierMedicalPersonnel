package com.example.backend.Dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.time.LocalDate;

public record RescheduleRdvRequest(
        @NotNull LocalDate newDate,
        // HH:mm ou HH:mm:ss si tu stockes avec secondes
        @NotNull @Pattern(regexp = "^\\d{2}:\\d{2}(:\\d{2})?$", message = "Heure au format HH:mm ou HH:mm:ss")
        String newHeure,
        String motif // optionnel
) {}
