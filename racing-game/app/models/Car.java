package models;

import javax.persistence.Entity;
import javax.persistence.Id;

import com.fasterxml.jackson.databind.JsonNode;

@Entity
public class Car {
	@Id
	public String ip;
	public double x;
	public double y;
	public double direction;
	public double speed;
	public String name;
}
