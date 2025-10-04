package com.example.backend.mapper;

import com.example.backend.Dto.RegisterUserRequest;
import com.example.backend.Dto.UserDto;
import com.example.backend.Entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserDtoMapper {

    UserDto toDto(User user);

    @Mapping(target = "image", ignore = true)
    User toEntity(RegisterUserRequest request);
}
