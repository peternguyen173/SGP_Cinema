package com.example.SGP.Cinema.services;

import com.example.SGP.Cinema.entities.Concession;
import com.example.SGP.Cinema.request.AddConcessionRequest;
import com.example.SGP.Cinema.response.ConcessionResponse;
import com.example.SGP.Cinema.response.MyApiResponse;
import org.springframework.stereotype.Service;

import java.util.List;

public interface ConcessionService {
    public List<Concession> getAllConcessions();
    public MyApiResponse deleteConcession(Long id);
    public ConcessionResponse addNewConcession(AddConcessionRequest req);
}
