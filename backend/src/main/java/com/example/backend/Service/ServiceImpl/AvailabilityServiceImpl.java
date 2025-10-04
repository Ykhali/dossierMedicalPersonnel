// src/main/java/.../Service/ServiceImpl/AvailabilityServiceImpl.java
package com.example.backend.Service.ServiceImpl;

import com.example.backend.Dto.AvailabilityResponse;
import com.example.backend.Entity.MedecinAbsence;
import com.example.backend.Entity.MedecinHoraire;
import com.example.backend.Entity.RendezVous;
import com.example.backend.Dao.MedecinAbsenceRepository;
import com.example.backend.Dao.MedecinHoraireRepository;
import com.example.backend.Dao.RendezVousRepository;
import com.example.backend.Service.Iservice.AvailabilityService;
import org.springframework.stereotype.Service;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AvailabilityServiceImpl implements AvailabilityService {

    private final MedecinHoraireRepository horaireRepo;
    private final MedecinAbsenceRepository absenceRepo;
    private final RendezVousRepository rdvRepo;

    private static final DateTimeFormatter HHMM = DateTimeFormatter.ofPattern("HH:mm");

    public AvailabilityServiceImpl(
            MedecinHoraireRepository horaireRepo,
            MedecinAbsenceRepository absenceRepo,
            RendezVousRepository rdvRepo
    ) {
        this.horaireRepo = horaireRepo;
        this.absenceRepo = absenceRepo;
        this.rdvRepo = rdvRepo;
    }

    @Override
    public AvailabilityResponse getAvailability(Long medecinId, LocalDate date, int slotMinutes) {
        if (slotMinutes < 5 || slotMinutes > 180 || (slotMinutes % 5 != 0)) {
            slotMinutes = 30; // sane default
        }

        // 1) find base intervals
        List<MedecinHoraire> base = horaireRepo.findByMedecin_IdAndDateSpecific(medecinId, date);
        if (base.isEmpty()) {
            base = horaireRepo.findByMedecin_IdAndDayOfWeek(medecinId, date.getDayOfWeek());
        }

        // if none, no work that day
        if (base.isEmpty()) {
            return new AvailabilityResponse(date.toString(), medecinId, slotMinutes, List.of());
        }

        // 2) generate all candidate slots from base intervals
        List<LocalTime> candidates = new ArrayList<>();
        for (MedecinHoraire h : base) {
            LocalTime t = h.getHeureDebut();
            while (!t.plusMinutes(slotMinutes).isAfter(h.getHeureFin())) {
                candidates.add(t);
                t = t.plusMinutes(slotMinutes);
            }
        }

        // 3) subtract absences (full or partial)
        List<MedecinAbsence> absences = absenceRepo.findByMedecin_IdAndDate(medecinId, date);
        if (!absences.isEmpty()) {
            candidates = candidates.stream().filter(t -> {
                for (MedecinAbsence a : absences) {
                    LocalTime s = Optional.ofNullable(a.getStartTime()).orElse(LocalTime.MIN);
                    LocalTime e = Optional.ofNullable(a.getEndTime()).orElse(LocalTime.MAX);
                    if (!t.isBefore(s) && t.isBefore(e)) return false; // slot blocked
                }
                return true;
            }).collect(Collectors.toList());
        }

        // 4) subtract already booked RDV
        List<RendezVous> booked = rdvRepo.findByMedecin_IdAndDateOrderByHeure(medecinId, date);
        Set<String> taken = booked.stream().map(RendezVous::getHeure).collect(Collectors.toSet());
        List<String> free = candidates.stream()
                .map(HHMM::format)
                .filter(hhmm -> !taken.contains(hhmm))
                .sorted()
                .toList();

        return new AvailabilityResponse(date.toString(), medecinId, slotMinutes, free);
    }
}
