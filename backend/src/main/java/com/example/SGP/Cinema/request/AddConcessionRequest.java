package com.example.SGP.Cinema.request;


import com.example.SGP.Cinema.entities.Concession;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;

public class AddConcessionRequest {



    @NotNull
    @JsonProperty("name")
    private String name;

    @NotNull
    @JsonProperty("imageURL")
    private String imageURL;

    @NotNull
    @JsonProperty("description")
    private String description;

    @NotNull
    @JsonProperty("price")
    private Long price;



    public @NotNull String getName() {
        return name;
    }

    public @NotNull String getImageURL() {
        return imageURL;
    }

    public @NotNull String getDescription() {
        return description;
    }

    public @NotNull Long getPrice() {
        return price;
    }
}

