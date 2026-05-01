package com.cloudcampus.auth.service;

import com.cloudcampus.auth.dto.ChangePasswordRequest;
import com.cloudcampus.auth.dto.LoginRequest;
import com.cloudcampus.auth.dto.LoginResponse;
import com.cloudcampus.auth.dto.UserProfileResponse;

public interface AuthService {

    LoginResponse login(LoginRequest request);

    UserProfileResponse currentProfile();

    void changePassword(ChangePasswordRequest request);
}
