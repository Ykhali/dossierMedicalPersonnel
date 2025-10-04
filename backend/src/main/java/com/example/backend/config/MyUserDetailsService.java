package com.example.backend.config;

import com.example.backend.Dao.UserRepository;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
class MyUserDetailsService implements UserDetailsService {
    private final UserRepository repo;
    MyUserDetailsService(UserRepository repo) { this.repo = repo; }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        var u = repo.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException(email));

        if (u.getDeleted()){
            throw new DisabledException("Le compte est supprimé");
        }
        // authorities à adapter
        return org.springframework.security.core.userdetails.User
                .withUsername(u.getEmail())
                .password(u.getMotdepasse()) // hash BCrypt en base
                .authorities("ROLE_" + u.getRole().name())
                .accountExpired(false)
                .accountLocked(false).credentialsExpired(false).disabled(u.getDeleted())
                .build();
    }
}

