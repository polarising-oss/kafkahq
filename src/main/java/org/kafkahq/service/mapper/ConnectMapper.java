package org.kafkahq.service.mapper;

import org.kafkahq.models.ConnectDefinition;
import org.kafkahq.models.ConnectPlugin;
import org.kafkahq.service.dto.connect.ConnectDefinitionDTO;
import org.kafkahq.service.dto.connect.ConnectPluginDTO;
import org.kafkahq.service.dto.connect.CreateConnectDefinitionDTO;

import javax.inject.Singleton;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Singleton
public class ConnectMapper {

    public ConnectDefinitionDTO fromConnectDefinitionToConnectDefinitionDTO(ConnectDefinition connect) {
        return new ConnectDefinitionDTO(
                connect.getName(),
                connect.getConfigsAsJson(),
                connect.getType(),
                connect.getShortClassName(),
                connect.getTasks()
                        .stream()
                        .map(this::fromTaskDefinitionToTaskDefinitionDTO)
                        .collect(Collectors.toList())
        );
    }


    private ConnectDefinitionDTO.TaskDefinitionDTO fromTaskDefinitionToTaskDefinitionDTO(ConnectDefinition.TaskDefinition taskDefinition) {
        return new ConnectDefinitionDTO.TaskDefinitionDTO(
                taskDefinition.getWorkerId(),
                taskDefinition.getId(),
                taskDefinition.getState()
        );
    }



    public ConnectPluginDTO fromConnectPluginToConnectPluginDTO(ConnectPlugin plugin){
        List<ConnectPlugin.Definition> definitions=plugin.getDefinitions();
        List<ConnectPluginDTO.DefinitionDTO>definitionsDTO= new ArrayList<>();
        for(int i=0; i<definitions.size();i++){
            definitionsDTO.add(
                    new ConnectPluginDTO.DefinitionDTO(
                            definitions.get(i).getName(),
                            definitions.get(i).getType(),
                            definitions.get(i).isRequired(),
                            definitions.get(i).getDefaultValue(),
                            definitions.get(i).getImportance(),
                            definitions.get(i).getDocumentation(),
                            definitions.get(i).getGroup(),
                            definitions.get(i).getWidth(),
                            definitions.get(i).getDisplayName(),
                            definitions.get(i).getDependents(),
                            definitions.get(i).getOrder()));
        }
        return new ConnectPluginDTO(plugin.getClassName(),plugin.getType(),plugin.getVersion(),definitionsDTO);
    }
}


