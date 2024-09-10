package com.example.SGP.Cinema.controller;

import com.example.SGP.Cinema.entities.Concession;
import com.example.SGP.Cinema.request.AddConcessionRequest;
import com.example.SGP.Cinema.response.ConcessionResponse;
import com.example.SGP.Cinema.response.MyApiResponse;
import com.example.SGP.Cinema.services.impl.ConcessionServiceImpl;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@Tag(name="Concession Endpoints")
@RequestMapping("/api/concession")
public class ConcessionController {

    @Autowired
    ConcessionServiceImpl ConcessionSER;


    @GetMapping("/getall")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<?> getAllConcessions() {
        return ResponseEntity.ok().body(ConcessionSER.getAllConcessions());
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ConcessionResponse addConcession(Principal principal, @RequestBody @Valid AddConcessionRequest concessionReq) {
        return ConcessionSER.addNewConcession(concessionReq);
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MyApiResponse> deleteConcession(@PathVariable Long id) {
        return ResponseEntity.ok().body(ConcessionSER.deleteConcession(id));
    }


}
