package com.example.backend.mapper;

import com.example.backend.Dto.*;
import com.example.backend.Entity.Medecin;
import com.example.backend.Entity.Patient;
import com.example.backend.Entity.Receptionniste;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ReceptionnisteDTOMapper {
    ReceptionnisteDto toDto(Receptionniste receptionniste);

    Receptionniste toEntity(AddReceptionnisteDto request);

    void update(UpdateReceptionnisteDto request, @MappingTarget Receptionniste receptionniste);

}
