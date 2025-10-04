package com.example.backend.Service.ServiceImpl;

import com.example.backend.Dao.UserRepository;
import com.example.backend.events.UserReactivatedEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;

    @Autowired
    private ApplicationEventPublisher publisher;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        var user = userRepository.findByEmail(email).orElseThrow(
                () -> new UsernameNotFoundException("Utilisateur non trouve"));

        return new User(
                user.getEmail(),
                user.getMotdepasse(),
                Collections.emptyList()
        );
    }

    @Transactional
    public void reactivateUser(Long userId) {
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setIs_deleted(false);

        userRepository.save(user);

        // fire event (do NOT block controller with notification logic)
        publisher.publishEvent(new UserReactivatedEvent(this, user.getId(), user.getEmail(), user.getTelephone(), user.getNom(), user.getPrenom()));
    }
}
