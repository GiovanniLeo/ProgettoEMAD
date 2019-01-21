/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mycompany.servletemad;

/**
 *
 * @author johnn
 */
public class Person {
    
    private int id = 0;
    private  String username;
    private String password;

    public Person( String username, String password) {
        this.id++;
        this.username = username;
        this.password = password;
    }

    public int getId() {
        return id;
    }

    private  void setId(int id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
    
    
    
    
    
}
