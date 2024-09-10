package com.example.SGP.Cinema.response;

import com.example.SGP.Cinema.entities.Concession;

public class ConcessionResponse {

    private Long id;
    private String name;
    private Long price;
    private String description;
    private String imageUrl;

    public ConcessionResponse() {
        this.id = 0L;
        this.name = "";
        this.price = 0L;
        this.description = "";
        this.imageUrl = "";
    }

    public ConcessionResponse(Concession concession) {
        this.id = concession.getId();
        this.name = concession.getName();
        this.imageUrl = concession.getImageUrl();
        this.price = concession.getPrice();
        this.description = concession.getDescription();
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Long getPrice() {
        return price;
    }

    public String getDescription() {
        return description;
    }

    public String getImageUrl() {
        return imageUrl;
    }
}
