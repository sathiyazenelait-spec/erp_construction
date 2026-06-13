package com.buildcon.erp.controller;

import com.buildcon.erp.model.Director;
import com.buildcon.erp.payload.request.DirectorSignupRequest;
import com.buildcon.erp.payload.response.MessageResponse;
import com.buildcon.erp.service.DirectorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/director")
public class DirectorController {

    @Autowired
    private DirectorService directorService;

    @PostMapping("/signup")
    public ResponseEntity<?> registerDirector(@RequestBody DirectorSignupRequest signUpRequest) {
        Director director = directorService.registerDirector(signUpRequest);
        return ResponseEntity.ok(new MessageResponse("Director registered successfully with ID: " + director.getId()));
    }
}
