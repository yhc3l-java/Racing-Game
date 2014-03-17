package controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.avaje.ebean.Ebean;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;

import models.Car;
import play.*;
import play.libs.Json;
import play.mvc.*;
import views.html.*;

public class Application extends Controller {

    public static Result index() {
        return ok(index.render("Your new application is ready."));
    }
    
    public static Result sendCarPosition(){
    	Map<String, String[]> parameters = request().body().asFormUrlEncoded();
    	
    	if(parameters == null){
    		throw new RuntimeException("null!");
    	}
    	
    	String ip = request().remoteAddress();
    	
    	Car car = Ebean.find(Car.class, ip);
    	
    	if(car == null){
    		car = new Car();
			car.ip = ip;
    	}
    	
    	car.x = Double.parseDouble(parameters.get("carX")[0]);
    	car.y = Double.parseDouble(parameters.get("carY")[0]);
    	car.direction = Double.parseDouble(parameters.get("direction")[0]);
    	car.speed = Double.parseDouble(parameters.get("speed")[0]);
    	car.name = parameters.get("name")[0];
    	
    	Ebean.save(car);
    	
    	return ok();
    }

    public static Result getCarPositions(){
    	List<Car> cars = Ebean.find(Car.class).findList();
    	
    	ArrayNode carResults = new ArrayNode(JsonNodeFactory.instance);
    	
    	for(Car car: cars){
    		ObjectNode carResult = Json.newObject();
    		
    		carResult.put("ip", car.ip);
    		carResult.put("name", car.name);
    		carResult.put("carX", car.x);
    		carResult.put("carY", car.y);
    		carResult.put("direction", car.direction);
    		carResult.put("speed", car.speed);
    		
    		carResults.add(carResult);
    	}
    	

		ObjectNode result = Json.newObject();
		result.put("cars", carResults);
    	
    	return ok(result);
    }
}
