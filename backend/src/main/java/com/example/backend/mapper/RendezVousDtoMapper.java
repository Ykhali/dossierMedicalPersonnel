package com.example.backend.mapper;

import com.example.backend.Dto.CreateRendezVousDto;
import com.example.backend.Dto.RendezVousDto;
import com.example.backend.Dto.UpdateRendezVousDto;
import com.example.backend.Entity.RendezVous;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface RendezVousDtoMapper {
    RendezVousDto toDto(RendezVous rendezVous);

    RendezVous toEntity(CreateRendezVousDto request);

    void update(UpdateRendezVousDto request, @MappingTarget RendezVous rendezVous);
}

