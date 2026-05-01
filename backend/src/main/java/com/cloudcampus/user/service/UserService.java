package com.cloudcampus.user.service;

import com.cloudcampus.user.dto.UserCreateRequest;
import com.cloudcampus.user.dto.UserResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {

    UserResponse createUser(UserCreateRequest request);

    Page<UserResponse> getUsers(Pageable pageable);
}
