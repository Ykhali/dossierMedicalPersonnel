package com.example.backend.Service.Iservice;

import com.example.backend.Entity.Admin;

import java.util.List;

public interface AdminService {
    Admin saveAdmin(Admin admin);
    Admin getAdmin(Long id);
    void deleteAdmin(Long id);
    Admin updateAdmin(Admin admin);
    List<Admin> getAllAdmins();
}
