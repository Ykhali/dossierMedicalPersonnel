package com.example.backend.Dao;

import com.example.backend.Entity.Admin;
import com.example.backend.Entity.Enums.Role;
import com.example.backend.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {
    Admin findAdminsById(Long id);

    Optional<Admin> findByEmail(String email);
    List<Admin> findAllByRole(Role role);

    @Query(value = "SELECT * FROM users WHERE email = :email", nativeQuery = true)
    Optional<User> findIncludingDeleted(@Param("email") String email);


}
