// src/main/java/com/example/backend/dto/WorkingHourDto.java
package com.example.backend.Dto;

import com.example.backend.Entity.Enums.Weekday;
import jakarta.validation.constraints.NotNull;
import java.time.LocalTime;

public class WorkingHourDto {
    @NotNull private Weekday day;
    @NotNull private LocalTime startTime; // ex: 09:00
    @NotNull private LocalTime endTime;   // ex: 17:00

    public Weekday getDay() { return day; }
    public void setDay(Weekday day) { this.day = day; }
    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }
    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }
}
