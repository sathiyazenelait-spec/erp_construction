package com.buildcon.erp.controller;

import com.buildcon.erp.model.QuantitySurveyor;
import com.buildcon.erp.payload.request.GenericSignupRequest;
import com.buildcon.erp.payload.response.MessageResponse;
import com.buildcon.erp.service.QuantitySurveyorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/quantity-surveyor")
public class QuantitySurveyorController {

    @Autowired
    private QuantitySurveyorService service;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody GenericSignupRequest request) {
        QuantitySurveyor res = service.register(request);
        return ResponseEntity.ok(new MessageResponse("Registered successfully with ID: " + res.getId()));
    }
}
