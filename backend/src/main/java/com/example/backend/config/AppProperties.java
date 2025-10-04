package com.example.backend.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "app")
@Getter @Setter
public class AppProperties {

    private Upload upload = new Upload();
    private Invoice invoice = new Invoice();
    private Assets assets = new Assets();

    private String publicBaseUrl;
    private String frontendBaseUrl;
    private String mailFrom;
    private String mailFromAddress;
    private String mailFromName;

    @Getter @Setter
    public static class Upload {
        private String dir; // app.upload.dir
    }

    @Getter @Setter
    public static class Invoice {
        private String baseDir;
        private boolean partitionByYearMonth = true;
    }

    @Getter @Setter
    public static class Assets {
        private String defaultMedecinLogo;
    }
}

