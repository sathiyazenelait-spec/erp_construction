package com.buildcon.erp.controller;

import com.buildcon.erp.model.NotificationLog;
import com.buildcon.erp.service.NotificationGatewayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/notifications")
public class NotificationGatewayController {

    @Autowired
    private NotificationGatewayService notificationGatewayService;

    @GetMapping("/org/{orgId}")
    public ResponseEntity<?> getGatewayStatus(@PathVariable Long orgId) {
        Map<String, Object> stats = notificationGatewayService.getGatewayStats(orgId);
        return ResponseEntity.ok(stats);
    }

    @PostMapping("/dispatch")
    public ResponseEntity<?> dispatchNotification(@RequestBody NotificationLog request) {
        NotificationLog result = notificationGatewayService.dispatch(request);
        return ResponseEntity.ok(result);
    }
}
