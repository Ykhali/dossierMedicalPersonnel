package com.example.backend.Service.ServiceImpl;

import com.example.backend.Dao.AdminRepository;
import com.example.backend.Entity.Admin;
import com.example.backend.Service.Iservice.AdminService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminServiceImpl implements AdminService {

    private AdminRepository adminRepository;

    @Override
    public Admin saveAdmin(Admin admin) {
        return adminRepository.save(admin);
    }

    @Override
    public Admin getAdmin(Long id) {
        return adminRepository.findAdminsById(id);
    }

    @Override
    public void deleteAdmin(Long id) {
        //adminRepository.deleteById(String.valueOf(id));

    }

    @Override
    public Admin updateAdmin(Admin admin) {
        return null;
    }

    @Override
    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }
}
