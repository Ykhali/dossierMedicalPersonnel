package com.example.backend.mapper;

import com.example.backend.Dto.HistoriqueRendezVousDto;
import com.example.backend.Entity.HistoriqueRendezVous;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface historiqueRvMapper {
    HistoriqueRendezVousDto toDto(HistoriqueRendezVous historiqueRendezVous);
}

