package com.example.backend.RestController;

import com.example.backend.Dto.PatientFolderDTO;
import com.example.backend.Dto.YearDocsDTO;
import com.example.backend.Service.ServiceImpl.ReceptionService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reception")
public class ReceptionController {

    private final ReceptionService service;

    public ReceptionController(ReceptionService service) {
        this.service = service;
    }

    @GetMapping("/today")
    @PreAuthorize("hasRole('RECEPTIONNISTE')")
    public List<PatientFolderDTO> today() {
        return service.getTodayFolders();
    }

    @GetMapping("/patients/{cin}/years")
    @PreAuthorize("hasRole('RECEPTIONNISTE')")
    public List<Integer> years(@PathVariable String cin) {
        return service.getYearsForCin(cin);
    }

    @GetMapping("/patients/{cin}/year/{year}")
    @PreAuthorize("hasRole('RECEPTIONNISTE')")
    public YearDocsDTO docsByYear(@PathVariable String cin, @PathVariable int year) {
        return service.getDocsByYear(cin, year);
    }
}
