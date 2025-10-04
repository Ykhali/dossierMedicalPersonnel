package com.example.backend.mapper;

import com.example.backend.Dto.AddPatientDto;
import com.example.backend.Dto.PatientDto;
import com.example.backend.Dto.UpdatePatientDto;
import com.example.backend.Entity.Patient;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface PatientDTOMapper {

    @Mapping(target = "dateDeCreation", expression = "java(java.time.LocalDateTime.now())")
    PatientDto toDto(Patient patient);

    @Mapping(target = "image", ignore = true)
    Patient toEntity(AddPatientDto request);

    void update(UpdatePatientDto request, @MappingTarget Patient patient);
}
