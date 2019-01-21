/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mycompany.servletemad;

import com.google.gson.Gson;
import java.util.ArrayList;

/**
 *
 * @author johnn
 */
public class DB {

    private ArrayList<Person> people;

    public DB() {
        people = new ArrayList<>();
        inizializeDb();
    }

    public void addPerson(Person p) {
        people.add(p);
    }

    public ArrayList<Person> getPeople() {
        return people;
    }

    private void inizializeDb() {
        people.add(new Person("Ugo", "123"));
        people.add(new Person("Franco", "1234"));
        people.add(new Person("Ciccio", "1235"));
        people.add(new Person("Leo", "1236"));
        people.add(new Person("Oroso", "1237"));
        people.add(new Person("Bob", "1238"));
        people.add(new Person("Frank", "1239"));
        people.add(new Person("Frix", "923"));
        people.add(new Person("Johan", "1823"));

    }
    
    public String toJson()
    {
        String json="";
        Gson gson = new Gson();
        for (int i = 0 ; i < people.size();i++) {
            json+=gson.toJson(people.get(i));
        }
        return json;
    }

}
