package org.kafkahq.service;

import org.kafkahq.models.ConnectPlugin;
import org.kafkahq.modules.KafkaModule;
import org.kafkahq.repositories.ConnectRepository;
import org.kafkahq.service.dto.connect.ConnectDefinitionDTO;
import org.kafkahq.service.dto.connect.ConnectPluginDTO;
import org.kafkahq.service.dto.connect.DeleteConnectDefinitionDTO;
import org.kafkahq.service.mapper.ConnectMapper;

import javax.inject.Inject;
import javax.inject.Singleton;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Singleton
public class ConnectService {

    private KafkaModule kafkaModule;

    private ConnectMapper connectMapper;

    private ConnectRepository connectRepository;

    @Inject
    public ConnectService(KafkaModule kafkaModule, ConnectMapper connectMapper, ConnectRepository connectRepository) {
        this.kafkaModule = kafkaModule;
        this.connectMapper = connectMapper;
        this.connectRepository = connectRepository;
    }

    public List<String> getAllConnectNames(String clusterId) {
        return new ArrayList<>(this.kafkaModule.getConnectRestClient(clusterId).keySet());
    }

    public List<ConnectDefinitionDTO> getConnectDefinitions(String clusterId, String connectId) {
        return this.connectRepository.getDefinitions(clusterId, connectId)
                .stream()
                .map(connectDefinition -> connectMapper.fromConnectDefinitionToConnectDefinitionDTO(connectDefinition))
                .collect(Collectors.toList());
    }

    public List<ConnectDefinitionDTO> deleteConnectDefinition(DeleteConnectDefinitionDTO deleteConnectDefinitionDTO) {
        this.connectRepository.delete(
                deleteConnectDefinitionDTO.getClusterId(),
                deleteConnectDefinitionDTO.getConnectId(),
                deleteConnectDefinitionDTO.getDefinitionId()
        );

        return this.connectRepository.getDefinitions(
                deleteConnectDefinitionDTO.getClusterId(),
                deleteConnectDefinitionDTO.getConnectId()
        )
                .stream()
                .map(connectDefinition -> connectMapper.fromConnectDefinitionToConnectDefinitionDTO(connectDefinition))
                .collect(Collectors.toList());
    }

   public List<ConnectPluginDTO> getConnectPlugins(String clusterId, String connectId){
    List<ConnectPlugin> plugins= connectRepository.getPlugins(clusterId,connectId);
    List<ConnectPluginDTO> pluginsDTO=new ArrayList<>();
    for (int i=0; i< plugins.size();i++){
        ConnectPluginDTO plugin= connectMapper.fromConnectPluginToConnectPluginDTO(plugins.get(i));
        pluginsDTO.add(plugin);
    }
    return pluginsDTO;

   }
/*
   public ConnectPluginDTO getConnectPlugin (String clusterId, String connectId, String className) {
           return connectMapper.fromConnectPluginToConnectPluginDTO(connectRepository.getPlugin(clusterId, connectId, className));

   }

 */
}