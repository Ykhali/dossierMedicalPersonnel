package com.example.backend.Entity;

import com.example.backend.Entity.Enums.Weekday;
import jakarta.persistence.*;

import java.time.LocalTime;

@Entity
@Table(
        name = "medecin_weekly_hours",
        uniqueConstraints = @UniqueConstraint(columnNames = {"medecin_id","weekday","start_time","end_time"})
)
public class MedecinWeeklyHour {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "medecin_id")
    private Medecin medecin;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Weekday weekday;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(name = "slot_minutes", nullable = false)
    private Short slotMinutes = 30; // 15/20/30…

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Medecin getMedecin() {
        return medecin;
    }

    public void setMedecin(Medecin medecin) {
        this.medecin = medecin;
    }

    public Weekday getWeekday() {
        return weekday;
    }

    public void setWeekday(Weekday weekday) {
        this.weekday = weekday;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public Short getSlotMinutes() {
        return slotMinutes;
    }

    public void setSlotMinutes(Short slotMinutes) {
        this.slotMinutes = slotMinutes;
    }
}
