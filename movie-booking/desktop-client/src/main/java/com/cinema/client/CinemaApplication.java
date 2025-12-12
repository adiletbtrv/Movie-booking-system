package com.cinema.client;

import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.layout.StackPane;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebView;
import javafx.stage.Stage;
import netscape.javascript.JSObject;

import java.net.URL;

public class CinemaApplication extends Application {

    public static void main(String[] args) {
        launch(args);
    }

    @Override
    public void start(Stage primaryStage) {
        primaryStage.setTitle("Cinema Enterprise Booking System");

        // Initialize WebView
        WebView webView = new WebView();
        WebEngine webEngine = webView.getEngine();

        // Configure WebEngine
        webEngine.setJavaScriptEnabled(true);

        // Load the React Application
        URL url = getClass().getResource("/react-app/index.html");
        if (url != null) {
            webEngine.load(url.toExternalForm());
        } else {
            System.err.println("Error: Could not find /react-app/index.html");
            webEngine.loadContent("<h1>Error: React App not found</h1><p>Please copy your built React files to <code>src/main/resources/react-app/</code>.</p>");
        }

        // Add Console Listener for debugging React errors
        webEngine.documentProperty().addListener((observable, oldDoc, newDoc) -> {
            if (newDoc != null) {
                JSObject window = (JSObject) webEngine.executeScript("window");
                window.setMember("javaConsole", new JavaConsoleBridge());
                webEngine.executeScript("console.log = function(message) { javaConsole.log(message); };");
                webEngine.executeScript("console.error = function(message) { javaConsole.error(message); };");
            }
        });

        // Setup Scene
        StackPane root = new StackPane();
        root.getChildren().add(webView);
        
        Scene scene = new Scene(root, 1024, 768);
        
        primaryStage.setScene(scene);
        primaryStage.show();
    }

    // Bridge to print JS console logs to Java System.out
    public static class JavaConsoleBridge {
        public void log(String message) {
            System.out.println("[React Log] " + message);
        }
        public void error(String message) {
            System.err.println("[React Error] " + message);
        }
    }
}
