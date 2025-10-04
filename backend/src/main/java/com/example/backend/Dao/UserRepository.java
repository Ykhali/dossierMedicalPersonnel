package com.example.backend.Dao;

import com.example.backend.Dto.LoginRequest;
import com.example.backend.Dto.UserDto;
import com.example.backend.Entity.User;
import com.example.backend.Dao.LightUserView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    @Query("""
        select u.id as id, u.email as email, u.motdepasse as motdepasse,
               u.cin as cin, u.Nom as nom, u.Prenom as prenom, u.role as role, u.telephone as telephone,
                   u.deleted as deleted
        from User u
        where u.email = :email
    """)
    Optional<AuthUserView> findAuthByEmail(@Param("email") String email);


    boolean existsByEmail(String email);

    Optional<User> findByTelephone(String telephone);

    List<User> findByDeletedFalse();

    List<User> findByDeletedTrue();

    Optional<User> findByIdAndDeletedTrue(Long id);
}
