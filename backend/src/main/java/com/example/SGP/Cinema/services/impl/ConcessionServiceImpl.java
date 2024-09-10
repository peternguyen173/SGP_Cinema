package com.example.SGP.Cinema.services.impl;

import com.example.SGP.Cinema.entities.Concession;
import com.example.SGP.Cinema.repository.ConcessionRepository;
import com.example.SGP.Cinema.request.AddConcessionRequest;
import com.example.SGP.Cinema.response.ConcessionResponse;
import com.example.SGP.Cinema.response.MyApiResponse;
import com.example.SGP.Cinema.services.ConcessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConcessionServiceImpl implements ConcessionService {

    @Autowired
    private ConcessionRepository ConcessionREPO;

    @Override
    public List<Concession> getAllConcessions(){
        return ConcessionREPO.findAll();
    }

    @Override
    public MyApiResponse deleteConcession(Long id) {
        if (ConcessionREPO.existsById(id)) {
            ConcessionREPO.deleteById(id);
            return new MyApiResponse("Concession deleted successfully.");
        } else {
            return new MyApiResponse( "Concession not found.");
        }
    }


    @Override
    public ConcessionResponse addNewConcession(AddConcessionRequest req){
        Concession newConcession = new Concession();
        newConcession.setName(req.getName());
        newConcession.setDescription(req.getDescription());
        newConcession.setImageUrl(req.getImageURL());
        newConcession.setPrice(req.getPrice());

        ConcessionREPO.save(newConcession);
        return new ConcessionResponse(newConcession);
    }

}
