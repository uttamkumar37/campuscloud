package com.cloudcampus.user.repository;

import com.cloudcampus.user.entity.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserAccountRepository extends JpaRepository<UserAccount, UUID> {

    Optional<UserAccount> findByUsernameAndActiveTrue(String username);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
}
