package com.example.backend.mapper;

import com.example.backend.Dto.*;
import com.example.backend.Entity.Medecin;
import com.example.backend.Entity.Patient;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface MedecinDTOMapper {
    MedecinDto toDto(Medecin medecin);

    @Mapping(target = "image", ignore = true)
    Medecin toEntity(AddMedecinDto request);
    void update(UpdateMedecinDto request, @MappingTarget Medecin medecin);
}
