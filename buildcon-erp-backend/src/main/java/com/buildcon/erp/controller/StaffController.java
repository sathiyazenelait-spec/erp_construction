package com.buildcon.erp.controller;

import com.buildcon.erp.model.Staff;
import com.buildcon.erp.payload.request.StaffSignupRequest;
import com.buildcon.erp.payload.response.MessageResponse;
import com.buildcon.erp.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/staff")
public class StaffController {

    @Autowired
    private StaffService staffService;

    @PostMapping("/signup")
    public ResponseEntity<?> registerStaff(@RequestBody StaffSignupRequest signUpRequest) {
        Staff staff = staffService.registerStaff(signUpRequest);
        return ResponseEntity.ok(new MessageResponse("Staff registered successfully with ID: " + staff.getId()));
    }
}
