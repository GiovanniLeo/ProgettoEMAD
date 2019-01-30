package it.babysafeseat.database;

import org.bson.Document;

import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

public class DatabaseManager {
  public static MongoCollection<Document> getUsers() {
    return getDB().getCollection(users);
  }

  public static MongoCollection<Document> getChannels() {
    return getDB().getCollection(channels);

  }

  public static void close() {
    if (client != null) client.close();
    client = null;
  }

  private static MongoDatabase getDB() {
    if(client == null) client = new MongoClient("localhost", 27017);
    return client.getDatabase(dbName);
  }

  private static MongoClient client = null;
  private static final String dbName = "BabySafeDatabase";
  private static final String users = "coll_users";
  private static final String channels = "coll_appchannel";
}
