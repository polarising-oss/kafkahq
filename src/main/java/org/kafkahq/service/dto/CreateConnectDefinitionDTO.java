package org.kafkahq.service.dto;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateConnectDefinitionDTO {
    private  String name;
    private  String type;
    private  Map<String, String> configs;
    private List<TaskDefinition> tasks;
    private  Gson gson = new GsonBuilder().setPrettyPrinting().create();


    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static  class TaskDefinition {
        private String connector;
        private int id;
        private String state;
        private String workerId;
        private String trace;
    }
}
